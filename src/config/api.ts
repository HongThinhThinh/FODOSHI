import axios from "axios";

const api = axios.create({
  baseURL: "http://14.225.198.143:8080/api/",
  // baseURL: "http://localhost:8081/api/",
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHJpbmciLCJyZWZyZXNoIjoiZTY2ZjAwYzMtYzE0Ny00NGI4LWE1ZTgtMjIwNDhjYjIwZjBhIiwiZXhwIjoxNzQwNDM1MzA0LCJpYXQiOjE3NDA0MzE3MDQsInNjb3BlIjoiUk9MRV9DT05TSUdOT1IifQ.2mfOLmNRc-dJ6Yfsx78X12jH5AZwZ8ejCuievFsn1WEmHsxrCIBQgn0yCCpjyfTQByEqxOhljHjSx4g98bGJtA";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
