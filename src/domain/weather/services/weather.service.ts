import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { convertToUTC } from '../../../helpers/convertToUTC';
import { AnswerFormatOut, answers } from '../../../constants/answers';
import { WeatherIn } from '../dtos/weather.dto';
import { DailyData } from '../../../interfaces/dailyData.interface';

@Injectable()
/** @class WeatherService representing a service provider with all methods. */
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Returns the weather description for the location (lat, lng) for a given date (date).
   *
   * @param {number} lat Geographical coordinates of the location (latitude).
   * @param {number} lng Geographical coordinates of the location (longitude)
   * @param {string} date Given date.
   * @return {json} JSON object with the weather description.
   */
  async getWeather({ lat, lng, date }: WeatherIn): Promise<AnswerFormatOut> {
    const dailyData = await this.getWeatherDailyData(lat, lng);
    const descByDate = this.findDescriptionByDate(dailyData, date);

    if (!descByDate) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: answers.error.emptyObject,
      };
    }

    return {
      data: descByDate?.weather[0]?.description,
    };
  }

  /**
   * Gets an open weather API url.
   *
   * @param {number} lat Latitude.
   * @param {number} lng Longitude.
   * @return {string} Open weather API url.
   */
  generateWeatherApiUrl(lat: number, lng: number): string {
    const openWeatherUrl = this.configService.get('OPEN_WEATHER_KEY');
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&appid=${openWeatherUrl}`;
  }

  /**
   * Gets a daily forecast weather data for a given location.
   *
   * @param {number} lat Latitude.
   * @param {number} lng Longitude.
   * @return {DailyData[]} Array of weather data with a daily forecast for a given location.
   */
  async getWeatherDailyData(lat: number, lng: number): Promise<DailyData[]> {
    const response = await lastValueFrom(
      this.httpService
        .get(this.generateWeatherApiUrl(lat, lng))
        .pipe(map((response) => response?.data?.daily)),
    );

    if (!response) {
      throw new HttpException(answers.error.notFoundData, HttpStatus.NOT_FOUND);
    }

    return response;
  }

  /**
   * Finds the daily forecast weather data for a specified date.
   *
   * @param {DailyData[]} data Array of daily forecast weather data for a given location.
   * @param {string} date Date passed in the params.
   * @return {DailyData} Daily forecast object for a given date.
   */
  findDescriptionByDate(data: DailyData[], date: string): DailyData {
    return data.find(
      (dailyObj) => convertToUTC(dailyObj.dt * 1000) === convertToUTC(date),
    );
  }
}
