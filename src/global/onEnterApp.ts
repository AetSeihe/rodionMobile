import {apiSettings} from '../api/api';
import {applicationStore} from '../store/applicationStore';
import {userStore} from '../store/userStore';
import {SCREEN_NAMES} from '../types/screen-names.type';
import {userAuthStorage} from '../utils/userAuthCash';

export const onEnterApp = async (): Promise<void> => {
  const userCash = await userAuthStorage.get();
  await applicationStore.cheakGeolocation();
  if (!userCash) {
    applicationStore.setInitialScreenName(SCREEN_NAMES.ONBOARDING);
    return;
  }

  apiSettings.setAuthorizationInHeader(userCash.token);
  const res = await userStore.setUserById(userCash.userId);

  if (!res) {
    applicationStore.addError({
      title: 'Ошибка загрузки профиля',
      text: 'Попробуйте войти еще раз',
    });
    applicationStore.setInitialScreenName(SCREEN_NAMES.ONBOARDING);
    return;
  }

  applicationStore.setInitialScreenName(SCREEN_NAMES.MAIN);
  return;
};
