import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import * as CONSTANTS from "../constants";
import { getLocalToken } from "../utils";
import { API_URL, Routes } from "../route";

const loaderShow = () => {
  const loader = document.getElementsByClassName(
    CONSTANTS.LOADER_CONTAINER
  )[0] as HTMLDivElement;
  if (loader) loader.style.display = "flex";
};

const loaderHide = () => {
  const loader = document.getElementsByClassName(
    CONSTANTS.LOADER_CONTAINER
  )[0] as HTMLDivElement;
  if (loader) loader.style.display = "none";
};

const toastError = (error: AxiosError<any>) => {
  const data = error.response?.data;

  if (data?.message && data?.message !== CONSTANTS.Strings.EMPTY) {
    toast.error(data.message);
    return;
  }

  toast.error(CONSTANTS.Strings.SERVICE_ERROR);
};

const instance = axios.create({
  baseURL: API_URL,
  headers:{
    "Content-Type": "application/json",
  }
});

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${getLocalToken()}`;
    loaderShow();
    return config;
  },
  (error) => {
    loaderHide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    loaderHide();
    return response;
  },
  async (error) => {
    loaderHide();
    const originalConfig = error.config;
    if (
      originalConfig.url?.slice(-6) !== Routes.LOGIN &&
      originalConfig.url?.slice(-7) !== Routes.LOGOUT &&
      error.response
    ) {
      console.log();
    }
    toastError(error);
    return Promise.reject(error);
  }
);

export default instance;
