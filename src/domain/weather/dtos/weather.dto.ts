import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

import { DateFormat } from '../../../validators/DateFormat';
import { DateRange } from '../../../validators/DateRange';

@InputType()
export class WeatherIn {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat!: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lng!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Validate(DateFormat)
  @Validate(DateRange)
  date!: string;
}
