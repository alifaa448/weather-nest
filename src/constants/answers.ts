import { Field, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

export const answers = {
  error: {
    invalidDateFormat: 'Invalid date format (mm-dd-yyyy or mm/dd/yyyy)',
    invalidDateValue: 'The date must be within the next 7 days.',
    emptyObject: 'The weather forecast for the specified date was not found.',
    notFoundData: 'The weather data was not found.',
  },
};

@ObjectType()
export class AnswerFormatOut {
  @Field()
  statusCode?: number;

  @Field()
  message?: string;

  @Field(() => JSON)
  data?: any;
}
