import {makeAutoObservable, runInAction} from 'mobx';
import {Asset} from 'react-native-image-picker';
import {apiSettings} from '../api/api';
import {userApi} from '../api/user.api';
import {User} from '../models/user.model';
import {LoginRequestType, SignUpRequestType} from '../types/api/user-api.types';
import {userAuthStorage} from '../utils/userAuthCash';

class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(data: LoginRequestType): Promise<boolean> {
    try {
      const {user, access_token} = await userApi.login(data);
      runInAction(() => {
        this.user = new User(user);
      });
      userAuthStorage.set({
        userId: user.id,
        token: access_token,
      });
      apiSettings.setAuthorizationInHeader(access_token);

      return true;
    } catch (e) {
      return false;
    }
  }

  async create(
    data: SignUpRequestType,
    image?: Asset | null,
  ): Promise<boolean> {
    try {
      const {user, access_token} = await userApi.create(data, image);
      runInAction(() => {
        this.user = new User(user);
      });
      userAuthStorage.set({
        userId: user.id,
        token: access_token,
      });
      apiSettings.setAuthorizationInHeader(access_token);

      return true;
    } catch (e) {
      return false;
    }
  }

  async setUserById(userId: number) {
    try {
      const user = await userApi.getUserById(userId);
      runInAction(() => {
        this.user = new User(user);
      });

      return true;
    } catch (e) {
      return false;
    }
  }
}

export const userStore = new UserStore();
