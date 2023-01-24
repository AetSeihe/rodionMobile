import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {colorTheme, mainFont} from '../theme/theme';
import {RouteInMapType} from '../types/map.type';
import {measurements} from '../utils/measurements';
import Button from './Button';

const closeImage = require('./images/close.png');

type Props = {
  route: RouteInMapType;
  onChangeVisibleCard: () => void;
  onClose: () => void;
  isFull: boolean;
  onPressStart: () => void;
};

const RouteCard = ({
  route,
  onClose,
  isFull,
  onChangeVisibleCard,
  onPressStart,
}: Props) => {
  const sharedAnimation = useSharedValue(0);

  useEffect(() => {
    if (isFull) {
      sharedAnimation.value = withSpring(1);
    } else {
      sharedAnimation.value = withSpring(0);
    }
  }, [isFull, sharedAnimation]);

  const animationImage = useAnimatedStyle(() => {
    const height = interpolate(sharedAnimation.value, [0, 1], [0, 158]);
    const marginTop = interpolate(sharedAnimation.value, [0, 1], [0, 15]);

    return {
      height,
      marginTop,
    };
  });

  const animationDescription = useAnimatedStyle(() => {
    const maxHeight = interpolate(sharedAnimation.value, [0, 1], [0, 1000]);

    return {
      maxHeight,
    };
  });

  const maxHeightAnimation = useAnimatedStyle(() => {
    const maxHeight = interpolate(sharedAnimation.value, [0, 1], [0, 1000]);
    const marginTop = interpolate(sharedAnimation.value, [0, 1], [0, 23]);

    return {
      maxHeight,
      marginTop,
    };
  });

  return (
    <View style={styles.wrapper} onTouchStart={onChangeVisibleCard}>
      <View style={styles.row}>
        <Text style={styles.title}>Владимир-Москва</Text>
        <TouchableOpacity onPress={onClose}>
          <Image
            style={styles.close}
            source={closeImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {!!route.route.preview && (
        <Animated.Image
          style={[styles.preview, animationImage]}
          source={{
            uri: route.route.preview.url,
          }}
        />
      )}

      <View style={styles.row}>
        <Text style={styles.text}>{route.info.time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{route.route.title}</Text>
        <Text style={styles.text}>
          {measurements.getKilometersByMeters(route.info.distance)} км
        </Text>
      </View>
      <Animated.Text style={[styles.text, animationDescription]}>
        {route.route.description}
      </Animated.Text>
      <Animated.View style={[styles.btn, maxHeightAnimation]}>
        <Button
          title="Проложить маршрут до начальной точки"
          onPress={() => onPressStart()}
        />
      </Animated.View>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    overflow: 'hidden',
  },
  wrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    paddingTop: 19,
    paddingHorizontal: 13,
    paddingBottom: 7,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  title: {
    color: colorTheme.text2,
    fontFamily: mainFont.bold,
    fontSize: 17,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  close: {
    width: 22,
    height: 22,
  },
  text: {
    overflow: 'hidden',
    fontFamily: mainFont.regular,
    fontSize: 14,
  },
  line: {
    position: 'absolute',
    top: 11,
    alignSelf: 'center',
    backgroundColor: '#E3E3E3',
    borderRadius: 5,
    width: 54,
    height: 5,
  },
  preview: {
    backgroundColor: 'gray',
    borderRadius: 10,
  },
});

export default RouteCard;
