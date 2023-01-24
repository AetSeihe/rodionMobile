import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import YaMap, {
  DrivingInfo,
  Marker,
  Polyline,
  RouteInfo,
} from 'react-native-yamap';
import RouteCard from '../../components/RouteCard';
import {Route} from '../../models/route.model';
import {applicationStore} from '../../store/applicationStore';
import {routeStore} from '../../store/routeStore';
import {colorTheme} from '../../theme/theme';
import {CordType, RouteInMapType} from '../../types/map.type';

const INITIAL_ZOOM = 13;

const plusIcon = require('./images/plus.png');
const minusIcon = require('./images/minus.png');
const geoIcon = require('./images/geo.png');
const pointIcon = require('./images/point.png');

const MapScreen = () => {
  const settingsRef = useRef({
    zoom: applicationStore.geolocation ? INITIAL_ZOOM : 5,
  });
  const [activeRoute, setActiveRoute] = useState<RouteInMapType | null>(null);
  const [routeToStartPoint, setRouteToStartPoint] =
    useState<RouteInMapType | null>(null);

  const [isFullVisibleActiveCard, setIsFullVisibleActiveCard] = useState(false);
  const [routesInMap, setRoutesInMap] = useState<RouteInMapType[]>([]);
  const ymapRef = useRef<YaMap | null>(null);

  const handlePressRoute = (route: RouteInMapType) => {
    setActiveRoute(route);
  };

  const handleCloseActiveRoute = () => {
    setActiveRoute(null);
    setIsFullVisibleActiveCard(false);
  };

  const makeRouteInMap = (info: any, route: Route) => {
    const routeInfo: RouteInfo<DrivingInfo> = info.routes[0];
    if (!routeInfo) {
      return;
    }
    const section = routeInfo.sections[1];
    if (!section) {
      return;
    }

    const points = routeInfo.sections
      .map(sec => {
        return sec.points;
      })
      .reduce((prev, acc) => {
        return [...prev, ...acc];
      }, []);

    setRoutesInMap(prev => {
      return [
        ...prev,
        {
          points: points,
          route: route,
          info: section.sectionInfo,
        },
      ];
    });
  };

  const makeUserRouteToMainRoute = (
    pointStart: CordType,
    pointEnd: CordType,
    route: Route,
  ) => {
    ymapRef.current?.findDrivingRoutes(
      [
        {
          lon: pointStart.lon,
          lat: pointStart.lat,
        },
        {
          lat: pointEnd.lat,
          lon: pointEnd.lon,
        },
      ],
      (info: any) => {
        const routeInfo: RouteInfo<DrivingInfo> = info.routes[0];
        if (!routeInfo) {
          return;
        }

        const points = routeInfo.sections
          .map(section => {
            return section.points;
          })
          .reduce((prev, acc) => {
            return [...prev, ...acc];
          }, []);

        setRouteToStartPoint({
          points: points,
          route: route,
          info: routeInfo.sections[0].routeInfo,
        });
      },
    );
  };

  const handleChangeRoutes = useCallback(
    (routes: Route[]) => {
      setRoutesInMap([]);
      routes.forEach(route => {
        if (!route.startPoint || !route.finishtPoint) {
          return;
        }

        const pointsMap: any | null = route.points?.map(point => ({
          lon: point.lat,
          lat: point.lon,
        }));

        if (!pointsMap) {
          return;
        }
        ymapRef.current?.findDrivingRoutes(pointsMap, info => {
          makeRouteInMap(info, route);
        });
      });
    },
    [ymapRef],
  );

  const fetchRoutes = async (pointStart: number[], pointFinish: number[]) => {
    if (activeRoute) {
      return;
    }
    await routeStore.fetchRoutesByCords({
      hidden: true,
      offset: 0,
      limit: 20,
      pointStart: pointStart,
      pointFinish: pointFinish,
    });

    handleChangeRoutes(routeStore.routesByCords);
  };

  const handleChangeVisibleMap = () => {
    ymapRef.current?.getVisibleRegion(region => {
      fetchRoutes(
        [region.topLeft.lat, region.topLeft.lon],
        [region.bottomRight.lat, region.bottomRight.lon],
      );
    });
  };

  useEffect(() => {
    ymapRef.current?.setCenter({
      lon: applicationStore.cords.lon,
      lat: applicationStore.cords.lat,
      zoom: settingsRef.current.zoom,
    });
  }, []);

  const onPressPlus = () => {
    settingsRef.current.zoom += 1;
    ymapRef.current?.setZoom(settingsRef.current.zoom);
  };

  const onPressMinus = () => {
    settingsRef.current.zoom -= 1;
    ymapRef.current?.setZoom(settingsRef.current.zoom);
  };

  const onPressSetUserInCenter = () => {
    settingsRef.current.zoom = INITIAL_ZOOM;
    ymapRef.current?.setCenter({
      lon: applicationStore.cords.lon,
      lat: applicationStore.cords.lat,
      zoom: INITIAL_ZOOM,
    });
  };

  const onPressStart = (route: Route) => {
    if (!activeRoute || !activeRoute.points[0]) {
      return;
    }
    const point = activeRoute.points[0];

    makeUserRouteToMainRoute(applicationStore.cords, point, route);
  };

  return (
    <View style={styles.wrapper}>
      <YaMap
        followUser={true}
        onCameraPositionChangeEnd={handleChangeVisibleMap}
        logoPosition={{
          horizontal: 'left',
          vertical: 'top',
        }}
        ref={ref => (ymapRef.current = ref)}
        rotateGesturesEnabled={false}
        style={styles.map}>
        {!!routeToStartPoint && (
          <Polyline
            points={routeToStartPoint.points}
            strokeColor={colorTheme.text}
            gapLength={2}
            dashLength={6}
          />
        )}
        {routesInMap.map(
          item =>
            item.route.startPoint && (
              <Marker
                key={item.route.id}
                onPress={() => handlePressRoute(item)}
                point={{
                  lat: item.route.startPoint.lon || 0,
                  lon: item.route.startPoint.lat || 0,
                }}>
                <Image
                  source={pointIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </Marker>
            ),
        )}
      </YaMap>

      <View style={styles.interface}>
        <View style={styles.eventContainer}>
          <TouchableOpacity style={styles.iconWrapper} onPress={onPressPlus}>
            <Image
              style={styles.sizeIcon}
              source={plusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={onPressMinus}>
            <Image
              style={styles.sizeIcon}
              source={minusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapIconWrapper}
            onPress={onPressSetUserInCenter}>
            <Image
              style={styles.mapIcon}
              source={geoIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {!!activeRoute && (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            style={styles.activeRouteCard}>
            <RouteCard
              route={activeRoute}
              onPressStart={() => onPressStart(activeRoute.route)}
              onChangeVisibleCard={() =>
                setIsFullVisibleActiveCard(prev => !prev)
              }
              onClose={handleCloseActiveRoute}
              isFull={isFullVisibleActiveCard}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  interface: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  wrapper: {
    flex: 1,
  },
  map: {
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: 'gray',
  },

  eventContainer: {
    alignItems: 'flex-end',
    padding: 10,
  },
  iconWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  sizeIcon: {
    width: 22,
    height: 22,
  },
  mapIconWrapper: {
    marginTop: 29,
    backgroundColor: '#fff',
    elevation: 2,
    padding: 10,
    borderRadius: 50,
  },
  mapIcon: {
    width: 36,
    height: 36,
  },
  icon: {
    width: 20,
    height: 20,
  },
  activeRouteCard: {
    width: '100%',
    bottom: 0,
    zIndex: 1,
  },
});

export default observer(MapScreen);
