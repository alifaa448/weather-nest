import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { convertToUTC } from '../../../helpers/convertToUTC';
import { AnswerFormatOut, answers } from '../../../constants/answers';
import { WeatherIn } from '../dtos/weather.dto';

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
    const openWeatherUrl = this.configService.get('OPEN_WEATHER_KEY');
    const dailyData = await lastValueFrom(
      this.httpService
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&appid=${openWeatherUrl}`,
        )
        .pipe(map((response) => response?.data?.daily)),
    );

    if (!dailyData) {
      throw new HttpException(answers.error.notFoundData, HttpStatus.NOT_FOUND);
    }

    const descByDate = dailyData.find(
      (dailyObj) => convertToUTC(dailyObj.dt * 1000) === convertToUTC(date),
    );

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
}
