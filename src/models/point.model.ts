import {PointType} from '../types/api/route-api.types';
import {File} from './file.model';

export class Point {
  id: number;
  order: number;
  title: string;
  description: string;
  lon: number;
  lat: number;
  previewId: number;
  iconId: number;
  audioId: number | null;
  routeId: number;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  preview: File | null;
  icon?: File;
  audio?: File;

  constructor(data: PointType) {
    this.id = data.id;
    this.order = data.order;
    this.title = data.title;
    this.description = data.description;
    this.lon = data.lon;
    this.lat = data.lat;
    this.previewId = data.previewId;
    this.iconId = data.iconId;
    this.audioId = data.audioId;
    this.routeId = data.routeId;
    this.hidden = data.hidden;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
    this.preview = data.preview ? new File(data.preview) : null;
    this.icon = data.icon && new File(data.icon);
    this.audio = data.audio && new File(data.audio);
  }
}
