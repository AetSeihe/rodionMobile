import axios from 'axios';

export const BASE_URL = 'https://d2c7-93-177-174-71.eu.ngrok.io';

const axiosConfig = {
  Authorization: '',
};

const setAuthorizationInHeader = (token: string) => {
  axiosConfig.Authorization = `Bearer ${token}`;
};

const getApiHeader = () => {
  return axiosConfig;
};

const instance = axios.create({
  baseURL: BASE_URL,
});

export const apiSettings = {setAuthorizationInHeader, getApiHeader};
export default instance;
