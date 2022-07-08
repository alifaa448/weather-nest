import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Weather (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/weather', (done) => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{ 
                weatherByDate(WeatherIn: { lat: ${42.98}, lng: ${-81.2}, date: "07/14/2022" }) { 
                    data 
                } 
            }`,
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.weatherByDate).toStrictEqual({
          data: 'broken clouds',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
