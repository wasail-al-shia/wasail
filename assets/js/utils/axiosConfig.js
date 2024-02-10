import axios from "axios";

const backend = axios.create({
  baseURL: "/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

backend.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Axios interceptor error:", error);
    // we have to throw the error so react query goes into onError callbacks!
    throw error;
  }
);

export { backend };
