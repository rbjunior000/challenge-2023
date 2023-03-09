/* eslint-disable react-hooks/rules-of-hooks */
import { configure } from "axios-hooks";
import Axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig() || {};

const axios = Axios.create({
  baseURL:
    publicRuntimeConfig.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4001/api/v1/",
});

axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userToken = window.localStorage.getItem("user_token");
    config.headers.Authorization = `Bearer ${
      userToken !== null ? JSON.parse(userToken) : ""
    }`;
  }

  return config;
});

configure({
  axios,
  defaultOptions: {
    autoCancel: false,
    useCache: false,
  },
});
