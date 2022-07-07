import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { convertToUTC } from '../helpers/convertToUTC';
import { answers } from '../constants/answers';

/**
 * @class DateRange implementing custom validation logic on the date belonging to the interval.
 * @param {string} date Formatting date.
 * @method defaultMessage defines a default error message.
 */
@ValidatorConstraint({ name: 'dateRange', async: false })
export class DateRange implements ValidatorConstraintInterface {
  validate(date: string) {
    const currentDate = new Date();
    const lastDateOfWeek = new Date(currentDate);
    lastDateOfWeek.setDate(lastDateOfWeek.getDate() + 7);

    return (
      convertToUTC(date) >= convertToUTC(currentDate) &&
      convertToUTC(date) <= convertToUTC(lastDateOfWeek)
    );
  }

  defaultMessage() {
    return answers.error.invalidDateValue;
  }
}
