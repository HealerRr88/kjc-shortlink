import * as apiUrls from "../api_url";
import { AxiosClient } from "../axios_client";
const axiosClient = new AxiosClient();

export const getPagingLinks = async (data) => {
  try {
    let url = apiUrls.LINKS_GET_PAGING;
    url += data.pageIndex ? `/?pageIndex=${data.pageIndex}` : '?pageIndex=1';
    url += data.pageSize ? `&pageSize=${data.pageSize}` : '&pageSize=20';
    url += data.user ? `&user=${data.user}` : '';
    url += data.key ? `&key=${data.key}` : '';
    url += data.url ? `&url=${data.url}` : '';
    url += data.note ? `&note=${data.note}` : '';
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const createLink = async (data) => {
  try {
    return await axiosClient.post(apiUrls.LINK_CREATE, data);
  } catch (error) {
    throw error;
  }
};

export const updateLink = async (data) => {
  try {
    return await axiosClient.put(`${apiUrls.LINK_UPDATE}/${data._id}`, data);
  } catch (error) {
    throw error;
  }
};

export const removeLink = async (id) => {
  try {
    return await axiosClient.delete(`${apiUrls.LINK_DELETE}/${id}`);
  } catch (error) {
    throw error;
  }
};