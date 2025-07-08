import axios from "axios";

const instance = axios.create({
  baseURL: "/api", // ✅ Proxy will forward this to backend
});

export default instance;
