import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {ImageSourcePropType, StyleSheet} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  SlideInRight,
  SlideOutDown,
  SlideOutLeft,
  SlideOutUp,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/Button';
import {LogoImage} from '../../images';
import {colorTheme, mainFont} from '../../theme/theme';
import {SCREEN_NAMES} from '../../types/screen-names.type';

type OnBoardingStapeType = {
  index: number;
  urlImage: ImageSourcePropType;
  title: string;
  subtitle: string;
  text: string;
};

const onBoardingSteps: OnBoardingStapeType[] = [
  {
    index: 1,
    urlImage: require('./images/step-1.png'),
    title: 'Путешествуй вместе',
    subtitle: 'с Историей!',
    text: 'Выберите подходящий маршрут и историческую тему',
  },
  {
    index: 2,
    urlImage: require('./images/step-2.png'),
    title: 'Сохраняйте важное и находите новое!',
    subtitle: 'и находите новое',
    text: 'Доступно более 30 маршрутов, обновление каждый месяц',
  },
  {
    index: 3,
    urlImage: require('./images/step-3.png'),
    title: 'Изучайте места ',
    subtitle: 'и пользуйтесь бонусами!',
    text: 'Сотни объекты культурного и исторического наследия на протяжении маршрутов. А также спец.предложения от музеев, кафе и других заведений',
  },
];

const COUNT_STEPS = onBoardingSteps.length + 1;

const Onboarding = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(1);

  const onPressNext = () => {
    setStep(prev => prev + 1);

    if (step + 1 === COUNT_STEPS) {
      setTimeout(() => {
        navigation.replace(SCREEN_NAMES.AUTHORIZATION);
      }, 500);
    }
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      {step !== COUNT_STEPS && (
        <Animated.Image
          exiting={SlideOutUp.delay(100)}
          style={styles.logo}
          source={LogoImage}
          resizeMode="contain"
        />
      )}
      {onBoardingSteps.map(
        st =>
          st.index === step && (
            <>
              <Animated.Image
                entering={SlideInRight.delay(100).duration(500)}
                exiting={SlideOutLeft.duration(500)}
                style={styles.image}
                source={st.urlImage}
                resizeMode="contain"
              />
              <Animated.Text
                entering={FadeInDown.delay(100)}
                exiting={FadeOutUp}
                style={styles.title}>
                {st.title}
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(300)}
                exiting={FadeOutUp.delay(150)}
                style={styles.subtitle}>
                {st.subtitle}
              </Animated.Text>
              <Animated.Text
                entering={FadeIn.delay(400)}
                exiting={FadeOut.delay(150)}
                style={styles.text}>
                {st.text}
              </Animated.Text>
            </>
          ),
      )}

      {step !== COUNT_STEPS && (
        <>
          <Animated.View
            exiting={SlideOutDown.delay(100)}
            style={styles.dotsWrapper}>
            {onBoardingSteps.map(st => (
              <Animated.View
                key={st.index}
                style={[
                  styles.dot,
                  st.index === step ? styles.dotActive : styles.noop,
                ]}
              />
            ))}
          </Animated.View>
          <Animated.View exiting={SlideOutDown.delay(100)}>
            <Button style={styles.next} title="Далее" onPress={onPressNext} />
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noop: {},
  wrapper: {
    flex: 1,
    paddingTop: 67,
    paddingBottom: 30,
  },

  logo: {
    width: 182,
    height: 43,
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    width: 275,
    height: 275,
    alignSelf: 'center',
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: mainFont.bold,
    color: colorTheme.main,
    letterSpacing: -0.5,
    marginBottom: -15,
  },
  subtitle: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: mainFont.bold,
    color: colorTheme.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  text: {
    alignSelf: 'center',
    maxWidth: 300,
    textAlign: 'center',
    fontFamily: mainFont.light,
    color: colorTheme.text,
    marginBottom: 14,
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 8,
    borderRadius: 17,
    backgroundColor: colorTheme.sub,
    marginHorizontal: 4.5,
  },
  dotActive: {
    opacity: 0.7,
    backgroundColor: colorTheme.main,
    width: 16,
  },

  next: {
    maxWidth: 292,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Onboarding;
