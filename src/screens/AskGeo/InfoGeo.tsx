import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutUp,
} from 'react-native-reanimated';
import Button from '../../components/Button';
import {BASE_DURATION} from '../../constants/animation';
import {LogoLightImage} from '../../images';
import {colorTheme, mainFont} from '../../theme/theme';
import {SCREEN_NAMES} from '../../types/screen-names.type';

const previewImage = require('./images/info-geo.png');

const InfoGeo = () => {
  const [isVisibleScreen, setisVisibleScreen] = useState(true);
  const navigation = useNavigation<any>();
  const handlePressNext = () => {
    setisVisibleScreen(false);
    setTimeout(() => {
      navigation.replace(SCREEN_NAMES.ASK_GEO);
    }, BASE_DURATION * 1.5);
  };
  return (
    <>
      {isVisibleScreen && (
        <Animated.View
          style={styles.wrapper}
          exiting={FadeOut.delay(BASE_DURATION)}>
          <Animated.Image
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={styles.logo}
            source={LogoLightImage}
            resizeMode="contain"
          />
          <Animated.Image
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.preview}
            source={previewImage}
            resizeMode="contain"
          />
          <Animated.Text
            entering={FadeInLeft}
            exiting={FadeOutLeft}
            style={styles.title}>
            Просмотр геопозиции
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(200)}
            exiting={FadeOutDown}
            style={styles.text}>
            Приложение отслеживает данные о вашем местоположении для работы
            навигатора, выстраивания маршрутов и подбора исторических точек
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(200)} exiting={FadeOutDown}>
            <Button
              style={styles.next}
              textStyle={styles.nextText}
              title="Далее"
              onPress={handlePressNext}
            />
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colorTheme.main,
    paddingHorizontal: 33,
  },
  logo: {
    width: 230,
    height: 55,
    alignSelf: 'center',
    flex: 1,
  },
  preview: {
    width: 300,
    height: 215,
    marginBottom: 30,
  },
  title: {
    fontFamily: mainFont.bold,
    color: '#fff',
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 15,
  },
  text: {
    fontFamily: mainFont.regular,
    color: '#fff',
    lineHeight: 22,
    fontSize: 15,
    marginBottom: 21,
  },
  next: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },

  nextText: {
    color: colorTheme.main,
  },
});

export default InfoGeo;
