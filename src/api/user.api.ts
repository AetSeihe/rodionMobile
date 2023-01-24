import {AxiosResponse} from 'axios';
import {Asset} from 'react-native-image-picker';
import {
  LoginRequestType,
  AuthResponseType,
  SignUpRequestType,
  UserResponseType,
} from '../types/api/user-api.types';
import instance, {apiSettings} from './api';

const login = async (data: LoginRequestType): Promise<AuthResponseType> => {
  const res: AxiosResponse<AuthResponseType> = await instance.post(
    '/auth/login',
    data,
  );
  return res.data;
};

const getUserById = async (userId: number): Promise<UserResponseType> => {
  const res: AxiosResponse<UserResponseType> = await instance.get(
    `/users/${userId}`,
    {
      headers: apiSettings.getApiHeader(),
    },
  );
  return res.data;
};

const create = async (
  data: SignUpRequestType,
  image?: Asset | null,
): Promise<AuthResponseType> => {
  const formData = new FormData();

  Object.keys(data).map((key: string) => {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  });

  if (image) {
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: image.type,
    });
  }

  const res: AxiosResponse<AuthResponseType> = await instance.post(
    '/users',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return res.data;
};

export const userApi = {login, create, getUserById};
