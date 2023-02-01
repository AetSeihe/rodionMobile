import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { MapObservered } from '../../components/Map';
import { SearchFormObservered } from '../../components/SearchForm';
import { applicationStore } from '../../store/applicationStore';
import { FeatureMember } from '../../types/api/yandexMap.api';
import { GeolocationType } from '../../types/map.type';
import { FeaturePointCard } from './components/PointCard';


const closeIcon = require('./images/left.png')


type PointType = 'map' | 'route'

type PointStateType = {
  type: PointType,
  point: FeatureMember
}




const HomeScreen = () => {
  const initialGeolocationValue: GeolocationType = applicationStore.geolocation ? 'auto' : null;
  const [selectedPoint, setSelectedPoint] = useState<PointStateType | null>(null);
  const [geolocation, setGeolocation] = useState<GeolocationType>(initialGeolocationValue)

  const onPressSearchPoint = (point: FeatureMember) => {
    setSelectedPoint({
      type: 'map',
      point: point
    })
  };


  const onPressButton = () => {
    Alert.alert(`Вы выбрали маршрут ${selectedPoint?.point.GeoObject.name}`)
  }

  const closeSelectedPoint = () => {
    setSelectedPoint(null)
  }

  const onPressChangeGeolocation = () => {
    if (geolocation === 'auto') {
      setGeolocation(null)
    }
    if (geolocation !== 'auto') {
      setGeolocation('auto')
    }
  }

  return (
    <View style={styles.wrapper}>
      <SearchFormObservered geolocation={geolocation} onPressChangeGeolocation={onPressChangeGeolocation} />
      <MapObservered style={styles.map} onPressSearchPoint={onPressSearchPoint} />
      {selectedPoint && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.alert}>
          <TouchableOpacity style={styles.closeWrapper} onPress={closeSelectedPoint}>
            <Animated.Image entering={SlideInLeft} exiting={SlideOutLeft} style={styles.close} source={closeIcon} resizeMode='contain' />
          </TouchableOpacity>
          <View style={styles.card}>
            <FeaturePointCard point={selectedPoint.point} buttonTitle='Построить маршрут' onPressButton={onPressButton} />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  alert: {
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  card: {
    width: '100%',
  },

  closeWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
  close: {
    width: 30,
    height: 30,
  },
});

export default HomeScreen;
