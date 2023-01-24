import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeInUp,
  FadeOutLeft,
  FadeOutUp,
  interpolate,
  SlideInDown,
  SlideInLeft,
  SlideOutDown,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Formik} from 'formik';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import * as yup from 'yup';

import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AddPhotoForm from '../../components/PhotoForm';
import {lockIcon, LogoLightImage, messageIcon} from '../../images';
import {colorTheme, mainFont} from '../../theme/theme';
import {phoneMaskReg} from '../../constants/regexp';
import {fieldLocale} from '../../locale';
import {LoginRequestType} from '../../types/api/user-api.types';
import {userStore} from '../../store/userStore';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/core';
import {SCREEN_NAMES} from '../../types/screen-names.type';
import {applicationStore} from '../../store/applicationStore';

const loginSchema = yup.object().shape({
  username: yup.string().required(fieldLocale.required),
  password: yup.string().required(fieldLocale.required),
});

const signUpSchema = yup.object().shape({
  name: yup.string().required(fieldLocale.required),
  email: yup.string().email(fieldLocale.email).required(fieldLocale.required),
  phone: yup.string().required(fieldLocale.required),
  password: yup.string().required(fieldLocale.required),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Поле должно совпадать с полем "Пароль"',
    )
    .required(fieldLocale.required),
});

const initialLoginValues: LoginRequestType = {
  username: '',
  password: '',
};

const initialSignUpValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const BASE_TIMING = 200;
const LOAYOUT_ANIMATION_BASE_TIMING = 400;
const DURATION = 300;
const Authorization = () => {
  const navigation = useNavigation<any>();
  const isSignInAnimated = useSharedValue(1);
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<Asset | null>(null);

  const animatedStyles = useAnimatedStyle(() => {
    const marginTop = interpolate(isSignInAnimated.value, [0, 1], [20, 111]);
    const marginBottom = interpolate(isSignInAnimated.value, [0, 1], [20, 70]);
    const marginLeft = interpolate(isSignInAnimated.value, [0, 1], [10, 50]);

    return {
      marginTop,
      marginBottom,
      marginLeft,
    };
  });

  const goToNextScreen = () => {
    setTimeout(() => {
      navigation.replace(SCREEN_NAMES.INFO_GEO);
    }, DURATION * 1.5);
  };
  const setAuthStatus = (status: boolean) => {
    isSignInAnimated.value = withTiming(status ? 1 : 0);
    setIsSignIn(status);
  };

  const handleAddPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    const imageAsset = result.assets;
    if (imageAsset && imageAsset[0]) {
      setImage(imageAsset[0]);
    }
  };

  const handleLogin = async (values: LoginRequestType) => {
    setLoading(true);
    const isSuccess = await userStore.login({
      username: '8' + values.username,
      password: values.password,
    });

    if (isSuccess) {
      goToNextScreen();
    } else {
      applicationStore.addError({
        title: 'Ошибка при входе',
        text: 'Неверный логин или пароль',
      });
    }
    setLoading(false);
  };

  const handleSignUp = async ({
    phone,
    ...values
  }: typeof initialSignUpValues) => {
    setLoading(true);
    const isSuccess = await userStore.create(
      {
        phone: '8' + phone,
        ...values,
      },
      image,
    );

    if (isSuccess) {
      goToNextScreen();
    } else {
      applicationStore.addError({
        title: 'Ошибка при регистрации',
        text: 'Пользователь с данным e-mail или номер телефона уже сущестует',
      });
    }
    setLoading(false);
  };
  return (
    <Animated.View
      style={styles.wrapper}
      entering={FadeIn.duration(BASE_TIMING * 2).delay(BASE_TIMING * 2)}>
      <Animated.Image
        exiting={FadeOutUp}
        entering={FadeInUp.delay(LOAYOUT_ANIMATION_BASE_TIMING).duration(
          LOAYOUT_ANIMATION_BASE_TIMING * 1.3,
        )}
        source={LogoLightImage}
        style={[styles.logo, animatedStyles]}
        resizeMode="contain"
      />
      <Animated.ScrollView
        exiting={SlideOutDown}
        entering={SlideInDown.delay(LOAYOUT_ANIMATION_BASE_TIMING * 2).duration(
          DURATION * 2,
        )}
        style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.title}>{isSignIn ? 'Вход' : 'Регистрация'}</Text>
          {isSignIn && (
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
              <Formik
                initialValues={initialLoginValues}
                onSubmit={handleLogin}
                validationSchema={loginSchema}>
                {({values, handleChange, handleSubmit, errors}) => (
                  <>
                    <InputField
                      label="Логин"
                      placeholder="Номер телефона"
                      icon={messageIcon}
                      mask={phoneMaskReg}
                      keyboardType="phone-pad"
                      wrapperStyle={styles.inputWrapper}
                      onChangeText={(masked, value) =>
                        handleChange('username')(value)
                      }
                      value={values.username}
                      error={errors.username}
                    />
                    <InputField
                      label="Пароль"
                      icon={lockIcon}
                      secret={true}
                      placeholder="*********"
                      onChangeText={masked => handleChange('password')(masked)}
                      value={values.password}
                      error={errors.password}
                    />
                    <Button
                      loading={loading}
                      title={'Войти'}
                      style={[styles.submit]}
                      onPress={handleSubmit}
                    />
                  </>
                )}
              </Formik>
            </Animated.View>
          )}
          {!isSignIn && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
              <Formik
                initialValues={initialSignUpValues}
                onSubmit={handleSignUp}
                validationSchema={signUpSchema}>
                {({handleSubmit, handleChange, values, errors}) => (
                  <>
                    <AddPhotoForm
                      onPress={handleAddPhoto}
                      wrapperStyle={styles.addPhoto}
                      image={image}
                    />
                    <InputField
                      label="ФИО"
                      wrapperStyle={styles.inputWrapper}
                      onChangeText={masked => handleChange('name')(masked)}
                      value={values.name}
                      error={errors.name}
                    />
                    <InputField
                      label="Email"
                      placeholder="qwerty@gmail.com"
                      keyboardType="email-address"
                      wrapperStyle={styles.inputWrapper}
                      onChangeText={masked => handleChange('email')(masked)}
                      value={values.email}
                      error={errors.email}
                    />
                    <InputField
                      label="Телефон"
                      keyboardType="phone-pad"
                      mask={phoneMaskReg}
                      onChangeText={(masked, value) =>
                        handleChange('phone')(value)
                      }
                      value={values.phone}
                      wrapperStyle={styles.inputWrapper}
                      error={errors.phone}
                    />
                    <InputField
                      placeholder="*********"
                      label="Пароль"
                      secret={true}
                      onChangeText={mask => handleChange('password')(mask)}
                      value={values.password}
                      wrapperStyle={styles.inputWrapper}
                      error={errors.password}
                    />
                    <InputField
                      label="Повторите пароль"
                      secret={true}
                      placeholder="*********"
                      onChangeText={mask =>
                        handleChange('confirmPassword')(mask)
                      }
                      value={values.confirmPassword}
                      error={errors.confirmPassword}
                    />
                    <Button
                      loading={loading}
                      title={'Создать'}
                      style={[styles.submit]}
                      onPress={handleSubmit}
                    />
                  </>
                )}
              </Formik>
            </Animated.View>
          )}
          <TouchableOpacity onPress={() => setAuthStatus(!isSignIn)}>
            <Text style={styles.authChangeBtn}>
              {isSignIn ? 'Cоздать аккаунт' : 'Войти'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  addPhoto: {
    marginBottom: 19,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colorTheme.background2,
  },

  logo: {
    width: 268,
    height: 63,
  },
  title: {
    fontFamily: mainFont.bold,
    fontSize: 15,
    marginBottom: 16,
    color: colorTheme.text,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  form: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 44,
  },
  inputWrapper: {
    marginBottom: 37,
  },
  submit: {
    marginTop: 40,
    marginBottom: 16,
  },
  authChangeBtn: {
    fontFamily: mainFont.bold,
    fontSize: 15,
    color: colorTheme.text,
    textAlign: 'center',
  },
});

export default observer(Authorization);
