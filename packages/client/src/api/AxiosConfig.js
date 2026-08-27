import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true
});

export const financeAIapi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL_FINANCE_AI,
  withCredentials: true
});