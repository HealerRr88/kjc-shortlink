import * as apiUrls from "../api_url";
import { AxiosClient } from "../axios_client";
const axiosClient = new AxiosClient();

export const getPagingLogs = async (data) => {
  try {
    let url = apiUrls.LOGS_GET_PAGING;
    url += data.pageIndex ? `/?pageIndex=${data.pageIndex}` : '?pageIndex=1';
    url += data.pageSize ? `&pageSize=${data.pageSize}` : '&pageSize=20';
    url += data.user ? `&user=${data.user}` : '';
    url += data.method ? `&method=${data.method}` : '';
    url += data.path ? `&path=${data.path}` : '';
    url += data.statusCode ? `&statusCode=${data.statusCode}` : '';
    url += data.startTime ? `&startTime=${data.startTime}` : '';
    url += data.endTime ? `&endTime=${data.endTime}` : '';
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const removeLog = async (id) => {
  try {
    return await axiosClient.delete(`${apiUrls.LOG_DELETE}/${id}`);
  } catch (error) {
    throw error;
  }
};
export const removeManyLogs = async (ids) => {
  try {
    return await axiosClient.post(apiUrls.LOG_DELETE_MANY, { ids });
  } catch (error) {
    throw error;
  }
};