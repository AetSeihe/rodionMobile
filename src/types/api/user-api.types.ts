import {FileType} from './file-api.types';

export type UserResponseType = {
  id: number;
  photoID: number;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  photo?: FileType;
};

export type LoginRequestType = {
  username: string;
  password: string;
};

export type SignUpRequestType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  [name: string]: any;
};

export type AuthResponseType = {
  user: UserResponseType;
  access_token: string;
};
