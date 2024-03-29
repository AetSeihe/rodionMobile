import { observer } from 'mobx-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import YaMap, { Marker } from 'react-native-yamap';
import { applicationStore } from '../store/applicationStore';
import { mapStore } from '../store/mapStore';
import { colorTheme } from '../theme/theme';
import { FeatureMember } from '../types/api/yandexMap.api';

const minusIcon = require('./images/minus.png');
const plusIcon = require('./images/plus.png');
const geoIcon = require('./images/geo.png');
const pointerIcon = require('./images/pointer.png');
const markerIcon = require('./images/marker.png');


type Props = {
  style?: {},
  searchPoints: FeatureMember[];
  currentRef: MutableRefObject<YaMap | null>,
  onPressSearchPoint: (point: FeatureMember) => void;
};

type PropsObserved = {
  style?: {},
  onPressSearchPoint: (point: FeatureMember) => void;
}

const MAP_DURATION = 0.2;
const ZOOM_STEP = 0.8;
const DEFAULT_ZOOM = 18;

type LocationIconStateType = 'compass' | 'pointer';

const Map = ({ style, searchPoints, currentRef, onPressSearchPoint }: Props) => {

  const [locationIconState, setLocationIconState] =
    useState<LocationIconStateType>('compass');
  const [mapAximut, setMapAzimut] = useState(0);
  const mapRef = useRef<YaMap | null>(null);
  currentRef.current = mapRef.current;
  useEffect(() => {
    mapRef.current?.getCameraPosition(options => {
      mapRef.current?.setCenter(
        {
          lon: applicationStore.cords.lon,
          lat: applicationStore.cords.lat,
        },
        DEFAULT_ZOOM,
        0,
        options.tilt,
        MAP_DURATION,
      );
    });
  }, [mapRef]);

  const onPressZoomIn = () => {
    mapRef.current?.getCameraPosition(options => {
      mapRef.current?.setZoom(options.zoom + ZOOM_STEP, MAP_DURATION);
    });
  };

  const onPressZoomOut = () => {
    mapRef.current?.getCameraPosition(options => {
      mapRef.current?.setZoom(options.zoom - ZOOM_STEP, MAP_DURATION);
    });
  };

  const onMapRotationChange = () => {
    mapRef.current?.getCameraPosition(options => {
      setMapAzimut(options.azimuth);
      if (options.azimuth === 0) {
        setLocationIconState('pointer');
      }
      if (options.azimuth !== 0) {
        setLocationIconState('compass');
      }
    });
  };

  const setAzimuthToZero = () => {
    mapRef.current?.getCameraPosition(options => {
      mapRef.current?.setCenter(
        {
          lon: applicationStore.cords.lon,
          lat: applicationStore.cords.lat,
        },
        options.zoom,
        0,
        options.tilt,
        MAP_DURATION,
      );
    });
  };

  const onPressIconLocation = () => {
    if (locationIconState === 'compass') {
      setAzimuthToZero();
    }
    if (locationIconState === 'pointer') {
      mapRef.current?.getCameraPosition(options => {
        mapRef.current?.setCenter(
          {
            lon: options.point.lon,
            lat: options.point.lat,
          },
          DEFAULT_ZOOM,
          0,
          options.tilt,
          MAP_DURATION,
        );
      });
    }
  };

  return (
    <View style={style}>
      <YaMap
        initialRegion={{
          lat: 0,
          lon: 0,
          azimuth: 0,
          zoom: 25,
        }}
        onCameraPositionChange={onMapRotationChange}
        ref={ref => (mapRef.current = ref)}
        style={styles.map}
      >
        {searchPoints.length > 0 && searchPoints.map((point) => (
          <Marker
            onPress={() => onPressSearchPoint(point)}
            source={markerIcon}
            key={point.GeoObject.boundedBy.Envelope.lowerCorner}
            point={{
              lon: +point.GeoObject.boundedBy.Envelope.lowerCorner.split(' ')[0],
              lat: +point.GeoObject.boundedBy.Envelope.lowerCorner.split(' ')[1],
            }} />
        ))}
      </YaMap>
      <View style={styles.content}>
        <TouchableOpacity style={styles.iconWrapper} onPress={onPressZoomIn}>
          <Image style={styles.icon} source={plusIcon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={onPressZoomOut}>
          <Image style={styles.icon} source={minusIcon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressIconLocation}
          style={[
            styles.iconWrapperGeo,
            locationIconState === 'pointer' ? styles.pointer : {},
          ]}>
          {locationIconState === 'compass' && (
            <Animated.Image
              entering={ZoomIn}
              exiting={ZoomOut}
              style={[
                styles.icon,
                {
                  transform: [
                    {
                      rotateZ: `-${mapAximut}deg`,
                    },
                  ],
                },
              ]}
              source={geoIcon}
              resizeMode="contain"
            />
          )}
          {locationIconState === 'pointer' && (
            <Animated.Image
              entering={ZoomIn}
              exiting={ZoomOut}
              style={styles.icon}
              source={pointerIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};


const MapObserver = (props: PropsObserved) => {
  const mapRef = useRef<YaMap | null>(null)
  const searchPoints = mapStore.geocode?.featureMember || []

  useEffect(() => {
    mapRef.current?.fitAllMarkers();
  }, [mapStore.geocode])


  return <Map {...props} searchPoints={searchPoints} currentRef={mapRef} />
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 7,
    shadowColor: '#000',

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 35,
    height: 35,
  },
  iconWrapperGeo: {
    padding: 13,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginTop: 50,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 45,
    height: 45,
  },
  pointer: {
    backgroundColor: colorTheme.main,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});


export const MapObservered = observer(MapObserver)
export default Map;
