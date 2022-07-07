import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { WeatherService } from '../domain/weather/services/weather.service';
import { WeatherResolver } from '../domain/weather/resolvers/weather.resolver';

/** @class WeatherModule bundling the weather controller and providers together. */
@Module({
  imports: [HttpModule],
  providers: [WeatherService, WeatherResolver],
})
export class WeatherModule {}
