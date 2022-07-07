import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('PORT', 3000);
  await app.listen(appPort, () => {
    console.log(`App is started on http://localhost:${appPort}/graphql`);
  });
}
bootstrap();
