import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
} from 'react-native-reanimated';
import Button from '../../components/Button';
import {BASE_DURATION} from '../../constants/animation';
import {LogoImage} from '../../images';
import {colorTheme, mainFont} from '../../theme/theme';
import {SCREEN_NAMES} from '../../types/screen-names.type';

const finishImage = require('./images/finish.png');

const OnboardingFinishScreen = () => {
  const [isVisibleScreen, setIsVisibleScreen] = useState(true);
  const navigation = useNavigation<any>();
  const goToNextScreen = () => {
    setIsVisibleScreen(false);

    setTimeout(() => {
      navigation.replace(SCREEN_NAMES.MAIN);
    }, BASE_DURATION * 1.5);
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
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.image}
            source={finishImage}
            resizeMode="contain"
          />
          <Animated.Text
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.title}>
            Желаем удачи!
          </Animated.Text>
          <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
            <Button title="Перейти к маршрутам" onPress={goToNextScreen} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  logo: {
    flex: 1,
    width: 230,
    height: 54,
    alignSelf: 'center',
  },
  image: {
    width: 307,
    height: 307,
    alignSelf: 'center',
    marginBottom: 58,
  },
  title: {
    fontFamily: mainFont.bold,
    color: colorTheme.main,
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 58,
  },
});

export default OnboardingFinishScreen;
