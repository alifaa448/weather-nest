import { Test, TestingModule } from '@nestjs/testing';

import { WeatherResolver } from './weather.resolver';
import { WeatherService } from '../services/weather.service';
import { AnswerFormatOut } from '../../../constants/answers';

const mockData: AnswerFormatOut = {
  data: 'clear sky',
};

const weatherServiceMock = {
  getWeather: jest.fn((): AnswerFormatOut => mockData),
};

describe('WeatherResolver', () => {
  let resolver: WeatherResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherResolver,
        {
          provide: WeatherService,
          useFactory: () => weatherServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<WeatherResolver>(WeatherResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return the weather description on 14 July, 2022', async () => {
    const lat = 42.98;
    const lng = -81.23;
    const date = '07/14/2022';

    const expectedResult = {
      data: 'clear sky',
    };

    const response = await resolver.weatherByDate({ lat, lng, date });
    expect(response).toEqual(expectedResult);
  });
});
