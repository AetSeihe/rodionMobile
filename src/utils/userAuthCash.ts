import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_AUTH_KEY = '@USER_AUTH_KEY';

export type UserAuthCashType = {
  userId: number;
  token: string;
};

const set = (data: UserAuthCashType) => {
  return AsyncStorage.setItem(USER_AUTH_KEY, JSON.stringify(data));
};

const get = async (): Promise<UserAuthCashType | null> => {
  const cash = await AsyncStorage.getItem(USER_AUTH_KEY);

  if (cash) {
    const data: UserAuthCashType = JSON.parse(cash);

    return data;
  }

  return null;
};

export const userAuthStorage = {set, get};
