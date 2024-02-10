// like lodash pick but can change keys
// pickAs({a: 1, b: 2}, [:a, [:b, :c]]) returns {a: 1, c: 2}
export const pickAs = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (typeof key === "string") return { ...acc, [key]: obj[key] };
    else {
      const [oldKey, newKey] = key;
      return { ...acc, [newKey]: obj[oldKey] };
    }
  }, {});

export const replace = (obj, values) =>
  values.reduce((acc, { key, value, newKey }) => {
    if (key in acc) {
      const { [key]: _oldValue, ...rest } = acc;
      return { ...rest, [newKey || key]: value };
    } else return acc;
  }, obj);

export const isObject = (variable) =>
  typeof variable === "object" && !Array.isArray(variable) && variable != null;
