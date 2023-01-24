import {RouteType} from '../types/api/route-api.types';
import {File} from './file.model';
import {Point} from './point.model';

export class Route {
  id: number;
  title: string;
  description: string;
  hidden: boolean;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  pointsCount: number;
  preview: File | null;
  points: Point[] | null;

  constructor(data: RouteType) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.hidden = data.hidden;
    this.creatorId = data.creatorId;
    this.updatedAt = new Date(data.updatedAt);
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
    this.createdAt = new Date(data.createdAt);
    this.pointsCount = data.pointsCount;
    this.preview = data.preview ? new File(data.preview) : null;
    this.points = data.points
      ? data.points.map(point => new Point(point))
      : null;
  }

  get startPoint(): Point | null {
    const point = this.points ? this.points[0] : null;

    return point;
  }

  get finishtPoint(): Point | null {
    return this.points ? this.points[this.points.length - 1] : null;
  }
}
