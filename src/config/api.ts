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
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHJpbmciLCJyZWZyZXNoIjoiNzU2ODBkYWMtODVjNC00YWQ0LWFkMTItZmQ5M2Y1ZGYyODk1IiwiZXhwIjoxNzQwMTc4NDQzLCJpYXQiOjE3NDAxNzQ4NDMsInNjb3BlIjoiUk9MRV9DT05TSUdOT1IifQ.G-4QwNu0GenjDhHmWr7yzpoBRHSQ90GBjqF04ZmLcTUMrzBVAi4UOXQtMiB0XQ3xXrzIG-06mwhBjV3VCsRXZQ";

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
