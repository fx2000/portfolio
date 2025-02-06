import { getApiBaseUrl } from "@/utils/utils";
import axios from "axios";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptors can be added here if needed
