import {makeAutoObservable, runInAction} from 'mobx';
import {geocode} from '../api/geocode.api';
import {GeoObjectCollection} from '../types/api/yandexMap.api';

class MapStore {
  geocode: GeoObjectCollection | null = null;
  loadingGeoCode: boolean = false;
  geocodeFetchError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchGeocodeByName(name: string) {
    runInAction(() => {
      this.loadingGeoCode = true;
    });

    try {
      const res = await geocode.ByName(name);
      runInAction(() => {
        this.geocode = res;
        this.loadingGeoCode = false;
      });
    } catch (e) {
      runInAction(() => {
        this.geocodeFetchError = 'Ошибка при запросе маршрутов';
        this.loadingGeoCode = false;
      });
    }
  }
}

export const mapStore = new MapStore();
