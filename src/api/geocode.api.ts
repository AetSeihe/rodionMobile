import {AxiosResponse} from 'axios';
import {GEOCODE_API_KEY} from '../constants/root';
import {GeocodeType} from '../types/api/yandexMap.api';
import instance from './api';

const ByName = async (title: string) => {
  const currentTitle = title.replace('', '+');
  const res: AxiosResponse<GeocodeType> = await instance.get(
    `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${GEOCODE_API_KEY}&geocode=${currentTitle}`,
  );

  return res.data.response.GeoObjectCollection;
};

export const geocode = {ByName};
