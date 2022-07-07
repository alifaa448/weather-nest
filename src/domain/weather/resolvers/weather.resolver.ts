import { Args, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { AnswerFormatOut } from '../../../constants/answers';
import { WeatherService } from '../services/weather.service';
import { WeatherIn } from '../dtos/weather.dto';

@Resolver()
/** @class WeatherResolver providing for turning a GraphQL operation into data. */
export class WeatherResolver {
  constructor(
    @Inject(WeatherService) private readonly weatherService: WeatherService,
  ) {}

  /**
   * Gets the weather description for a given date.
   *
   * @param {lat: number, lng: number, date: string} weatherIn The weather data transfer object.
   * @return {json} The weather description.
   */
  @Query(() => AnswerFormatOut)
  async weatherByDate(
    @Args('WeatherIn') weatherIn: WeatherIn,
  ): Promise<AnswerFormatOut> {
    return this.weatherService.getWeather(weatherIn);
  }
}
