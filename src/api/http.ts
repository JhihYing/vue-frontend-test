import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const interviewerName = import.meta.env.VITE_INTERVIEWER_NAME;

  if (interviewerName) {
    config.headers.interviewerName = interviewerName;
  }

  return config;
});

export default http;
