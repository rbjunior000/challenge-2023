/* eslint-disable react-hooks/rules-of-hooks */
import { configure } from "axios-hooks";
import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:4001/api/v1/",
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization =
    `Bearer ${JSON.parse(window?.localStorage?.getItem("user_token"))}` || "";

  // Declare a Map to store the identification and cancellation functions for each request
  const pending = new Map();
  /**
   * Add Request
   * @param {Object} config
   */
  const url = [
    config.method,
    config.url,
    // JSON.stringify(config.params),
    // JSON.stringify(config.data)
  ].join("&");
  // eslint-disable-next-line no-param-reassign
  config.cancelToken =
    config.cancelToken ||
    new Axios.CancelToken((cancel) => {
      if (!pending.has(url)) {
        pending.set(url, cancel);
      }
    });
  return config;
});

configure({
  axios,
  defaultOptions: {
    useCache: false,
  },
});
