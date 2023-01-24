import {DrivingInfo, RouteInfo} from 'react-native-yamap';
import {Route} from './route.model';

export class RouteInMap {
  route: Route;
  routeInfo: RouteInfo<DrivingInfo>;

  constructor(route: Route, routeInfo: RouteInfo<DrivingInfo>) {
    this.route = route;
    this.routeInfo = routeInfo;
  }
}
