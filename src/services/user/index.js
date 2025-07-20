import * as apiUrls from "../api_url";
import { AxiosClient } from "../axios_client";
const axiosClient = new AxiosClient();

export const verify = async (data) => {
  return await axiosClient.post(`${apiUrls.USER_VERIFY}`, data);
};

export const login = async (data) => {
  return await axiosClient.post(`${apiUrls.USER_LOGIN}`, data);
};

export const getPagingUsers = async (data) => {
  try {
    let url = `${apiUrls.USERS_GET_PAGING}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`;
    url += data.username ? `&username=${data.username}` : '';
    url += data.fullname ? `&fullname=${data.fullname}` : '';
    url += data.displayName ? `&displayName=${data.displayName}` : '';
    url += data.email ? `&email=${data.email}` : '';
    url += data.phoneNumber ? `&phoneNumber=${data.phoneNumber}` : '';
    url += data.status ? `&status=${data.status}` : '';
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (data) => {
  try {
    let url = `${apiUrls.USERS_GET_ALL}`;
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const getUserByToken = async (data) => {
  try {
    let url = `${apiUrls.USERS_GET_BY_TOKEN}`;
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data) => {
  return await axiosClient.post(`${apiUrls.USER_CREATE}`, data);
}

export const updateUser = async (data) => {
  return await axiosClient.put(`${apiUrls.USER_UPDATE}/${data._id}`, data);
}

export const removeUser = async (id) => {
  return await axiosClient.delete(`${apiUrls.USER_DELETE}/${id}`);
}