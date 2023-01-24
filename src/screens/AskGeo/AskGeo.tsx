import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutRight,
  FadeOutUp,
} from 'react-native-reanimated';
import Button from '../../components/Button';
import {BASE_DURATION} from '../../constants/animation';
import {LogoImage} from '../../images';
import {applicationStore} from '../../store/applicationStore';
import {colorTheme, mainFont} from '../../theme/theme';
import {SCREEN_NAMES} from '../../types/screen-names.type';

const askGeoImage = require('./images/ask-geo.png');

const AskGeo = () => {
  const [isVisibleScreen, setIsVisibleScreen] = useState(true);
  const navigation = useNavigation<any>();

  const goToNextScreen = () => {
    setIsVisibleScreen(false);
    setTimeout(() => {
      navigation.replace(SCREEN_NAMES.FINISH_ONBOARDING);
    }, BASE_DURATION * 1.9);
  };

  const handlePressAskGeolocation = async () => {
    const result = await applicationStore.askGeolocation();
    if (result) {
      goToNextScreen();
    } else {
      applicationStore.addError({
        title: 'Ошибка при запросе геолокации',
        text: 'Для корректной работы приложения необходимо выбрать "При использовании"',
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      {isVisibleScreen && (
        <>
          <Animated.Image
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={styles.logo}
            source={LogoImage}
            resizeMode="contain"
          />
          <Animated.Image
            entering={FadeInLeft}
            exiting={FadeOutRight}
            style={styles.image}
            source={askGeoImage}
            resizeMode="contain"
          />
          <Animated.Text
            entering={FadeInDown}
            exiting={FadeOut}
            style={styles.title}>
            Разрешить просмотр геопозиции
          </Animated.Text>
          <Animated.View
            entering={FadeInDown.delay(BASE_DURATION)}
            exiting={FadeOutDown.delay(BASE_DURATION * 1.5)}>
            <Button
              style={styles.button}
              title="Разрешить"
              onPress={handlePressAskGeolocation}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(BASE_DURATION * 1.5)}
            exiting={FadeOutDown.delay(BASE_DURATION)}>
            <Button title="Пропустить" onPress={goToNextScreen} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 33,
    paddingBottom: 30,
  },
  logo: {
    width: 230,
    height: 54,
    alignSelf: 'center',
    flex: 1,
  },
  image: {
    width: 169,
    height: 256,
    alignSelf: 'center',
    marginBottom: 61,
  },
  title: {
    color: colorTheme.main,
    fontFamily: mainFont.bold,
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 25,
  },
  button: {
    marginBottom: 16,
  },
});

export default AskGeo;
