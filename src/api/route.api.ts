import {AxiosResponse} from 'axios';
import {Route} from '../models/route.model';
import {
  FindRoutesByCordsRequest,
  RouteType,
} from '../types/api/route-api.types';
import instance, {apiSettings} from './api';

const findByCords = async (
  data: FindRoutesByCordsRequest,
): Promise<Route[]> => {
  const res: AxiosResponse<RouteType[]> = await instance.get(
    '/route/by-cords',
    {
      params: data,
      headers: apiSettings.getApiHeader(),
    },
  );

  return res.data.map(route => new Route(route));
};

export const routeApi = {findByCords};
