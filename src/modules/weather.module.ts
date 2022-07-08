import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { WeatherService } from '../domain/weather/services/weather.service';
import { WeatherResolver } from '../domain/weather/resolvers/weather.resolver';

/** @class WeatherModule bundling the weather controller and providers together. */
@Module({
  imports: [HttpModule],
  providers: [WeatherService, WeatherResolver, ConfigService],
})
export class WeatherModule {}
