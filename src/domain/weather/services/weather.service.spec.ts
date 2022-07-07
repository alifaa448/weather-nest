import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';

import { WeatherService } from './weather.service';
import { answers } from '../../../constants/answers';
import { WeatherIn } from '../dtos/weather.dto';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OPEN_WEATHER_KEY') {
                return '8e302fd091883f913f15c063d114a249';
              }
              return null;
            }),
          },
        },
      ],
      imports: [HttpModule],
    }).compile();

    config = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When getting a weather description', () => {
    describe('and date input parameter is invalid', () => {
      it('should return invalid date value & format error', async () => {
        const weatherData = new WeatherIn();
        weatherData.lat = 42.98;
        weatherData.lng = -81.23;
        weatherData.date = '07/062022';

        return validate(weatherData).then((errors) => {
          expect(errors[0]).toMatchObject({
            property: 'date',
            constraints: {
              dateFormat: answers.error.invalidDateFormat,
              dateRange: answers.error.invalidDateValue,
            },
          });
        });
      });

      it('should return error: The date must be within the next 7 days.', async () => {
        const weatherData = new WeatherIn();
        weatherData.lat = 42.98;
        weatherData.lng = -81.23;
        weatherData.date = '07/04/2022';

        return validate(weatherData).then((errors) => {
          expect(errors[0]).toMatchObject({
            property: 'date',
            constraints: {
              dateRange: answers.error.invalidDateValue,
            },
          });
        });
      });
    });

    describe('and latitude or longitude input parameter is invalid', () => {
      it('should return invalid longitude value error', async () => {
        const latitude = 42.98;
        const longitude = 260;
        const date = '07/14/2022';

        try {
          await service.getWeather({
            lat: latitude,
            lng: longitude,
            date,
          });
        } catch (error) {
          expect(error.response.data).toStrictEqual({
            cod: '400',
            message: 'wrong longitude',
          });
        }
      });

      it('should return invalid latitude value error', async () => {
        const latitude = 100;
        const longitude = -81.23;
        const date = '07/14/2022';

        try {
          await service.getWeather({
            lat: latitude,
            lng: longitude,
            date,
          });
        } catch (error) {
          expect(error.response.data).toStrictEqual({
            cod: '400',
            message: 'wrong latitude',
          });
        }
      });
    });

    describe('and input parameters are valid', () => {
      it('should return the weather description on 14 July, 2022', async () => {
        const latitude = 42.98;
        const longitude = -81.23;
        const date = '07/14/2022';

        const expectedResponse = {
          data: 'clear sky',
        };

        const response = await service.getWeather({
          lat: latitude,
          lng: longitude,
          date,
        });
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
