import {makeAutoObservable, runInAction} from 'mobx';
import {MutableRefObject} from 'react';
import YaMap, {DrivingInfo, RouteInfo} from 'react-native-yamap';
import {routeApi} from '../api/route.api';
import {Route} from '../models/route.model';
import {RouteInMap} from '../models/RouteInMap.model';
import {FindRoutesByCordsRequest} from '../types/api/route-api.types';

class RouteStore {
  routesByCords: Route[] = [];
  routesByMap: Map<number, RouteInMap> = new Map();
  routesByCordsLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRoutesByCords(data: FindRoutesByCordsRequest) {
    runInAction(() => {
      this.routesByCordsLoading = true;
    });
    const routes = await routeApi.findByCords(data);
    runInAction(() => {
      this.routesByCordsLoading = false;
      this.routesByCords = routes;
    });
  }

  async transformRoutesToMapType(
    route: Route,
    map: MutableRefObject<YaMap>,
  ): Promise<RouteInMap | null> {
    const candidate = this.routesByMap.get(route.id);
    if (candidate) {
      return candidate;
    }

    const points = route.points;
    if (!points) {
      return null;
    }
    try {
      const routeInfo: RouteInfo<DrivingInfo> = await new Promise(
        (res, rej) => {
          map.current?.findDrivingRoutes(points, (info: any) => {
            const mapRoute = info.routes[0];
            if (mapRoute) {
              res(mapRoute);
            }
            setTimeout(() => {
              rej(false);
            }, 10000);
          });
        },
      );

      const currentRoute = new RouteInMap(route, routeInfo);

      this.routesByMap.set(currentRoute.route.id, currentRoute);

      return currentRoute;
    } catch (e) {
      throw new Error('Не удалось загрузить маршрут');
    }
  }
}

export const routeStore = new RouteStore();
