import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-ukp4.onrender.com/api",
});

export default api;
