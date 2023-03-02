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
  config.headers.Authorization =
    `Bearer ${JSON.parse(window?.localStorage?.getItem("user_token"))}` || "";
  return config;
});

configure({
  axios,
  defaultOptions: {
    autoCancel: false,
    useCache: false,
  },
});
