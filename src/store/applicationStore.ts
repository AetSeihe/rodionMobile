import {makeAutoObservable, reaction, runInAction} from 'mobx';
import {Alert, Linking, Platform} from 'react-native';
import {request, check, PERMISSIONS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {DEFAULT_CORD} from '../constants/map';
import {CordType} from '../types/map.type';
import {SCREEN_NAMES} from '../types/screen-names.type';

const GEOLOCATION_PERMISSION_NAME =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

export type ApplicationErrorType = {
  title: string;
  text: string;
};

export type ApplicationItemErrorType = {
  index: number;
  title: string;
  text: string;
};

let WATCH_POSITION_ID: number | null;

class ApplicationStore {
  initialScreenName: SCREEN_NAMES = SCREEN_NAMES.ONBOARDING;
  geolocation: boolean = false;
  errors: ApplicationItemErrorType[] = [];
  cords: CordType = DEFAULT_CORD;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.geolocation === true,
      () => {
        this.handleChangeGeolocation();
      },
    );
  }

  handleChangeGeolocation() {
    if (WATCH_POSITION_ID) {
      Geolocation.clearWatch(WATCH_POSITION_ID);
    }
    if (this.geolocation) {
      WATCH_POSITION_ID = Geolocation.watchPosition(
        position => {
          runInAction(() => {
            this.cords = {
              lon: position.coords.longitude,
              lat: position.coords.latitude,
            };
          });
        },
        error => {
          this.addError({
            title: 'Ошибка при запросе геолокации',
            text: error.message,
          });
        },
        {
          distanceFilter: 1,
          enableHighAccuracy: true,
        },
      );
    }
  }

  setInitialScreenName(name: SCREEN_NAMES) {
    this.initialScreenName = name;
  }

  addError(error: ApplicationErrorType) {
    this.errors.unshift({
      ...error,
      index: Math.random() * 1000,
    });
  }

  deleteError(errorIndex: number) {
    this.errors = this.errors.filter((_, index) => index !== errorIndex);
  }

  async askGeolocation(): Promise<boolean> {
    const geolocationCheak = await this.cheakGeolocation();

    if (geolocationCheak) {
      return true;
    }

    const result = await request(GEOLOCATION_PERMISSION_NAME, {
      title: 'Разрешение на использование геолокации',
      message:
        'Для корректной работы приложения необходимо выбрать "При использовании"',
      buttonPositive: 'Разрешить',
      buttonNegative: 'Напомнить позже',
    });

    if (result === 'granted') {
      runInAction(() => {
        this.geolocation = true;
      });
      return true;
    }

    if (result === 'blocked') {
      this.askGoToSettings(
        'Чтобы пользоваться геолокацией нужно разрешить ее в настройках телефона',
      );
      return false;
    }

    return false;
  }

  async cheakGeolocation(): Promise<boolean> {
    const granted = await check(GEOLOCATION_PERMISSION_NAME);
    runInAction(() => {
      this.geolocation = granted === 'granted';
    });
    return granted === 'granted';
  }

  askGoToSettings(title: string) {
    Alert.alert('Возникла ошибка', title, [
      {
        text: 'Позже',
        onPress: () => {},
      },
      {
        text: 'Перейти',
        onPress: () => Linking.openSettings(),
      },
    ]);
  }
}

export const applicationStore = new ApplicationStore();
