import {FileType} from './file-api.types';

export type RouteType = {
  id: number;
  title: string;
  description: string;
  hidden: boolean;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  pointsCount: number;
  preview?: FileType;
  points?: PointType[];
};

export type PointType = {
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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview?: FileType;
  icon?: FileType;
  audio?: FileType;
};

export type FindRoutesByCordsRequest = {
  hidden: boolean;
  offset: number;
  limit: number;
  pointStart: number[];
  pointFinish: number[];
};
