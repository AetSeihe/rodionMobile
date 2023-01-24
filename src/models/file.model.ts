import {BASE_URL} from '../api/api';
import {FileType} from '../types/api/file-api.types';

export class File {
  id: number;
  name: string;
  originalName: string;
  mimetype: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: FileType) {
    this.id = data.id;
    this.name = data.name;
    this.originalName = data.originalName;
    this.mimetype = data.mimetype;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
  }

  get url() {
    return `${BASE_URL}/file/${this.name}`;
  }
}
