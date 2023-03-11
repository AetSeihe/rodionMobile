import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  interpolate,
  Layout,
  SlideInRight,
  SlideInUp,
  SlideOutRight,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mapStore } from '../store/mapStore';
import { colorTheme, mainFont } from '../theme/theme';
import { GeoObjectCollection } from '../types/api/yandexMap.api';
import { GeolocationType } from '../types/map.type';
import { declinationNumericWord } from '../utils/declinationNumericWord';
import Button from './Button';
import InputField from './InputField';

const markerIcon = require('./images/marker.png')

type Props = {
  onChangeWhereTo: (value: string) => void;
  onChangeWhereFrom: (value: string) => void;
  valueWhereTo: string;
  valueWhereFrom: string;
  geocode: GeoObjectCollection | null;
  loading: boolean;
  geolocation: GeolocationType,
  onPressChangeGeolocation: () => void;
};

type PropsObserved = {
  geolocation: GeolocationType,
  onPressChangeGeolocation: () => void;
}

const SearchForm = ({
  onChangeWhereTo,
  onChangeWhereFrom,
  valueWhereTo,
  valueWhereFrom,
  geocode,
  loading,
  geolocation,
  onPressChangeGeolocation
}: Props) => {
  const animation = useSharedValue<number>(0);
  const safeArea = useSafeAreaInsets();
  const openForm = () => {
    animation.value = withTiming(1);
  };

  const closeForm = () => {
    animation.value = withTiming(0);
  };

  const onBlurInput = () => {
    if (geolocation !== 'auto') {
      return;
    }
    closeForm();
  };

  const hiddenComponentStyle = useAnimatedStyle(() => {
    const maxHeight = interpolate(animation.value, [0, 1], [0, 200]);

    return {
      maxHeight,
      overflow: 'hidden',
    };
  });

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    const padding = interpolate(animation.value, [0, 1], [20, 0]);

    const marginTop = interpolate(animation.value, [0, 1], [safeArea.top - 10, 0]);


    return {
      padding,
      marginTop,
    };
  });


  const contentAnimatedStyle = useAnimatedStyle(() => {
    const paddingTop = interpolate(animation.value, [0, 1], [0, safeArea.top]);
    return {
      paddingTop,
    };
  });

  const metadata = geocode?.metaDataProperty.GeocoderResponseMetaData;
  const points = geocode?.featureMember;

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={[styles.wrapper, wrapperAnimatedStyle]}>
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <Animated.View style={hiddenComponentStyle}>
          {geolocation === 'auto' && (
            <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
              <TouchableOpacity style={styles.autoGeolocation} onPress={onPressChangeGeolocation}>
                <Image source={markerIcon} style={styles.autoGeolocationIcon} resizeMode='contain' />
                <View>
                  <Text style={styles.autoGeolocationTitle}>Использовать ваше местоположение</Text>
                  <Text style={styles.autoGeolocationText}>Ввести в ручную</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          {geolocation !== 'auto' && (
            <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
              <InputField
                style={styles.inputField}
                placeholder="Откуда"
                onChangeText={onChangeWhereFrom}
                value={valueWhereFrom}
              />
              <TouchableOpacity onPress={onPressChangeGeolocation}>
                <Text style={styles.autoGeolocationText}>Ввести в ручную</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
        <InputField
          onFocus={openForm}
          onBlur={onBlurInput}
          style={styles.inputField}
          placeholder="Поиск мест и адресов"
          onChangeText={onChangeWhereTo}
          value={valueWhereTo}
        />
        {loading && (
          <Animated.Text
            style={styles.status}
            entering={FadeIn}
            exiting={FadeOut}>
            Загрузка результатов
          </Animated.Text>
        )}
        {!!metadata?.found && !loading && (
          <Animated.Text
            style={styles.status}
            entering={FadeIn}
            exiting={FadeOut}>
            Найдено {metadata?.found}{' '}
            {declinationNumericWord(+metadata?.found, [
              'место',
              'места',
              'мест',
            ])}
          </Animated.Text>
        )}
        <Animated.View style={hiddenComponentStyle}>
          <Button title="Поиск" onPress={closeForm} />
        </Animated.View>
      </Animated.View>
      {points && (
        <Animated.ScrollView
          style={[styles.hintWrapper, hiddenComponentStyle]}
          entering={FadeIn}
          exiting={FadeOut}>
          {points.map(({ GeoObject }) => (
            <Animated.View
              style={styles.hintContent}
              key={GeoObject.boundedBy.Envelope.lowerCorner}
              layout={Layout.springify()}
              entering={SlideInRight}
              exiting={SlideOutRight}>
              <TouchableOpacity style={styles.hint}>
                <Text style={styles.hintText}>{GeoObject.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.ScrollView>
      )}
    </Animated.View>
  );
};

let timeoutToFetchGeoCode: number | null = null;

const SearchFormObserver = (props: PropsObserved) => {
  const [valueWhereTo, setValueWhereTo] = useState('');
  const [valueWhereFrom, setValueWhereFrom] = useState('')


  const onChangeWhereTo = (value: string) => {
    setValueWhereTo(value);
    if (timeoutToFetchGeoCode) {
      clearTimeout(timeoutToFetchGeoCode);
    }

    timeoutToFetchGeoCode = setTimeout(() => {
      mapStore.fetchGeocodeByName(value);
    }, 2000);
  };

  const onChangeWhereFrom = (value: string) => {
    setValueWhereFrom(value);
    if (timeoutToFetchGeoCode) {
      clearTimeout(timeoutToFetchGeoCode);
    }

    timeoutToFetchGeoCode = setTimeout(() => {
      mapStore.fetchGeocodeByName(value);
    }, 2000);
  };


  return (
    <SearchForm
      valueWhereTo={valueWhereTo}
      valueWhereFrom={valueWhereFrom}
      onChangeWhereTo={onChangeWhereTo}
      onChangeWhereFrom={onChangeWhereFrom}

      geocode={mapStore.geocode}
      loading={mapStore.loadingGeoCode}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  content: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputField: {
    backgroundColor: colorTheme.gray,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  hintWrapper: {
    backgroundColor: '#fff',
    marginTop: -10,
  },
  hint: {
    backgroundColor: colorTheme.gray,
    padding: 10,
    borderRadius: 5,
  },
  status: {
    marginBottom: 5,
    color: colorTheme.main,
  },
  hintText: {
    color: '#000',
    fontWeight: '600',
  },
  hintContent: {
    padding: 5,
    backgroundColor: '#fff',
  },

  autoGeolocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorTheme.main2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  autoGeolocationIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  autoGeolocationTitle: {
    fontFamily: mainFont.bold,
    color: colorTheme.main,
    fontSize: 16,
  },
  autoGeolocationText: {
    fontFamily: mainFont.regular,
    color: 'gray',
    fontSize: 14,
  },
});

export const SearchFormObservered = observer(SearchFormObserver);

export default SearchForm;
