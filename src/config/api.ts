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
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHJpbmciLCJyZWZyZXNoIjoiZDY3MmNjMDktMmY5Yy00NmY1LThiNDktNGIyMzU2NGIyYTE3IiwiZXhwIjoxNzQwNDY3NzU2LCJpYXQiOjE3NDA0NjQxNTYsInNjb3BlIjoiUk9MRV9DT05TSUdOT1IifQ.Hs8SCWDVeUgnL-XDbxP8lBwYpN-kgCJjkKGgnXI8HCMKq-6X1TEatUmOkeOzXK-L6SEPy0m7dkdsEMPrKGXWqg";
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
