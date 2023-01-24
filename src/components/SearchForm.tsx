import {observer} from 'mobx-react';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  Layout,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {mapStore} from '../store/mapStore';
import {colorTheme} from '../theme/theme';
import {GeoObjectCollection} from '../types/api/yandexMap.api';
import {declinationNumericWord} from '../utils/declinationNumericWord';
import Button from './Button';
import InputField from './InputField';

type Props = {
  onChangeWhereTo: (value: string) => void;
  valueWhereTo: string;
  geocode: GeoObjectCollection | null;
  loading: boolean;
};

const SearchForm = ({
  onChangeWhereTo,
  valueWhereTo,
  geocode,
  loading,
}: Props) => {
  const animation = useSharedValue<number>(0);

  const openForm = () => {
    animation.value = withTiming(1);
  };

  const closeForm = () => {
    animation.value = withTiming(0);
  };

  const onBlurInput = () => {
    if (geocode && geocode.featureMember.length >= 0) {
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

    return {
      padding,
    };
  });

  const metadata = geocode?.metaDataProperty.GeocoderResponseMetaData;
  const points = geocode?.featureMember;

  return (
    <Animated.View style={[styles.wrapper, wrapperAnimatedStyle]}>
      <View style={styles.content}>
        <Animated.View style={hiddenComponentStyle}>
          <InputField style={styles.inputField} placeholder="Откуда" />
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
          <Button style={styles.submit} title="Поиск" />
        </Animated.View>
      </View>
      {points && (
        <Animated.ScrollView
          style={[styles.hintWrapper, hiddenComponentStyle]}
          entering={FadeIn}
          exiting={FadeOut}>
          {points.map(({GeoObject}) => (
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

const SearchFormObserver = () => {
  const [valueWhereTo, setValueWhereTo] = useState('');

  const onChangeWhereTo = (value: string) => {
    setValueWhereTo(value);
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
      onChangeWhereTo={onChangeWhereTo}
      geocode={mapStore.geocode}
      loading={mapStore.loadingGeoCode}
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
    padding: 4,
    borderRadius: 5,
    marginVertical: 5,
  },
  submit: {
    paddingVertical: 5,
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
});

export const SearchFormObservered = observer(SearchFormObserver);

export default SearchForm;
