import { backend } from "./axiosConfig";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { isObject } from "./obj";

const request = (query) => {
  // when wrapping a graphql query with an axios request, the response format will be
  // { status: 200, data: { data: __} or {errors: __}}
  // console.log("graphql query", query);
  return backend
    .post("query", {
      query,
    })
    .then((res) => {
      if (res.data.errors) {
        console.log("graphql query errors:", res.data.errors);
        throw new Error(`graphql query error: ${res.data.errors[0]?.message}`);
      }
      if (typeof res.data == "object") {
        //console.log(res.data.data);
        return res.data.data;
      } else throw new Error("unknown graphql query error");
    });
};

const getMutation =
  (api, responseKeys = ["status", "message"]) =>
  (args) =>
    applyMutation(api, args, responseKeys);

const applyMutation = (api, args, responseKeys = ["status", "message"]) => {
  const query = jsonToGraphQLQuery({
    mutation: {
      [api]: {
        __args: cleanPayload(args),
        ...createResponseMap(responseKeys),
      },
    },
  });
  // console.log("query", query);
  return request(query);
};

const createResponseMap = (responseKeys) =>
  responseKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {});

// const parseEnumTypes = (payload) =>
//   Object.entries(payload).reduce(
//     (acc, [key, value]) => ({
//       ...acc,
//       [key]:
//         value instanceof EnumType
//           ? value.value.toUpperCase()
//           : isObject(value)
//           ? parseEnumTypes(value)
//           : value,
//     }),
//     {}
//   );

const generateParams = (obj) => {
  // console.log("object", obj);
  const paramString = Object.entries(obj)
    .reduce(
      (acc, [key, value]) =>
        value != null
          ? [
              ...acc,
              `${key}: ${
                value instanceof EnumType
                  ? value.value.toUpperCase()
                  : typeof value == "string"
                  ? `"${value}"`
                  : value
              }`,
            ]
          : acc,
      []
    )
    .join(", ");
  return paramString.length > 0 ? `(${paramString})` : "";
};

const cleanPayload = (payload) => {
  const ret = Object.entries(payload).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]:
        value === undefined || value === ""
          ? null
          : isObject(value) && !(value instanceof EnumType)
          ? cleanPayload(value)
          : value,
    }),
    {}
  );
  // console.log("cleanedPayload", ret);
  return ret;
};

export { request, getMutation, applyMutation, generateParams };
