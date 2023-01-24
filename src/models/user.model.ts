import {UserResponseType} from '../types/api/user-api.types';
import {File} from './file.model';

export class User {
  id: number;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  photo: File | null;

  constructor(data: UserResponseType) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.isAdmin = data.isAdmin;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
    this.photo = data.photo ? new File(data.photo) : null;
  }
}
