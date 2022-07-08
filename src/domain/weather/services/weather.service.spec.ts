import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';

import { WeatherService } from './weather.service';
import { answers } from '../../../constants/answers';
import { WeatherIn } from '../dtos/weather.dto';
import { DailyData } from '../../../interfaces/dailyData.interface';

const mockedDailyData: DailyData[] = [
  {
    dt: 1657818000,
    weather: [
      {
        id: 803,
        main: 'Clouds',
        description: 'broken clouds',
      },
    ],
  },
  {
    dt: 1657904400,
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
      },
    ],
  },
];

describe.only('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let config: ConfigService;
  let getWeatherDailyData: jest.Mock;

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

    getWeatherDailyData = jest.fn().mockResolvedValue(mockedDailyData);

    config = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
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

    it('should return the weather description on 14 July, 2022', async () => {
      const latitude = 42.98;
      const longitude = -81.23;
      const date = '07/14/2022';

      const expectedResponse = {
        data: 'broken clouds',
      };

      const response = await service.getWeather({
        lat: latitude,
        lng: longitude,
        date,
      });
      expect(response).toEqual(expectedResponse);
    });

    it('should return weather data for a given date was not found error', async () => {
      const latitude = 42.98;
      const longitude = -81.23;
      const date = '07/14/2022';

      const expectedResponse = {
        message: "The weather forecast for the specified date was not found.",
        statusCode: 204
      };

      service.findDescriptionByDate = jest.fn().mockResolvedValue({});

      const response = await service.getWeather({
        lat: latitude,
        lng: longitude,
        date,
      });
      expect(response).toStrictEqual(expectedResponse);
    });

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
});
