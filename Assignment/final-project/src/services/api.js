import axios from "axios";

const api = axios.create({
  baseURL: "https://mercury.swin.edu.au/cos30043/s103488418/Learniverse-api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
