import axios from "axios";
import { BEARER, TOKEN_NAME } from "../utilities/constants";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common['valid-key'] = 'rr88key';

const token = localStorage.getItem(TOKEN_NAME)
  ? localStorage.getItem(TOKEN_NAME)
  : null;

if (token)
  axios.defaults.headers.common["Authorization"] =
    BEARER + token.replace(/"/g, "");

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error.response?.data);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    if (error.response?.data.status === 401) {
      localStorage.removeItem(TOKEN_NAME);
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data);
  }
);

const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] =
    BEARER + token.replace(/"/g, "");
};

class AxiosClient {
  get = async (url, config) => {
    return axios.get(url, { ...config });
  };

  post = (url, data, config) => {
    return axios.post(url, data, { ...config });
  };

  put = (url, data, config) => {
    return axios.put(url, data, { ...config });
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getToken = () => {
  const token = localStorage.getItem(TOKEN_NAME);
  if (!token) {
    return null;
  } else {
    return token;
  }
};

export { AxiosClient, setAuthorization, getToken };
