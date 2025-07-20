import * as apiUrls from "../api_url";
import { AxiosClient } from "../axios_client";
const axiosClient = new AxiosClient();

export const getAll = async () => {
  try {
    return await axiosClient.get(apiUrls.ROLES_GET_ALL);
  } catch (error) {
    throw error;
  }
};

export const getPagingRoles = async () => {
  try {
    return await axiosClient.get(apiUrls.ROLES_GET_PAGING);
  } catch (error) {
    throw error;
  }
};

export const createRole = async (data) => {
  try {
    return await axiosClient.post(apiUrls.ROLE_CREATE, data);
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (data) => {
  try {
    return await axiosClient.put(`${apiUrls.ROLE_UPDATE}/${data._id}`, data);
  } catch (error) {
    throw error;
  }
};

export const removeRole = async (id) => {
  try {
    return await axiosClient.delete(`${apiUrls.ROLE_DELETE}/${id}`);
  } catch (error) {
    throw error;
  }
};