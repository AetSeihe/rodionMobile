import { DrivingInfo, Point } from 'react-native-yamap';
import { Route } from '../models/route.model';
import { FeatureMember } from './api/yandexMap.api';

export type CordType = {
  lon: number;
  lat: number;
};

export type RouteInMapType = {
  route: Route;
  points: Point[];
  info: DrivingInfo;
};

export type GeolocationType = 'auto' | FeatureMember | null;

