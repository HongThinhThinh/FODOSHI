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
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHJpbmciLCJyZWZyZXNoIjoiZWMwNDY4MDUtNzdiZi00NmYxLWFmYTYtMTM4OTZjZWU1YWM0IiwiZXhwIjoxNzQwNDQ4MjE4LCJpYXQiOjE3NDA0NDQ2MTgsInNjb3BlIjoiUk9MRV9DT05TSUdOT1IifQ.o4v-MQICX8FcWGd8p-lwvvhkX3Wr6fMbSlO1hVqlAlddwqpB2F1zc1Zmwx4HFl3ehdrQSgUHH1u-KqhMlcHSrw";
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
