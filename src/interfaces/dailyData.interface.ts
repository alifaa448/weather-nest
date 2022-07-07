import { Field, InterfaceType } from '@nestjs/graphql';

export interface Weather {
  id: number;
  main: string;
  description: string;
}

@InterfaceType()
export abstract class DailyData {
  @Field()
  dt: number;

  @Field()
  weather: [Weather];
}
