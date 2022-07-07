import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { answers } from '../constants/answers';

/**
 * @class DateFormat implementing custom validation logic for checking the date for the correct format.
 * @param {string} date Formatting date.
 * @method defaultMessage defining a default error message.
 */
@ValidatorConstraint({ name: 'dateFormat', async: false })
export class DateFormat implements ValidatorConstraintInterface {
  validate(date: string) {
    const dateRegex =
      /^(0[1-9]|1[012])[\/\-](0[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
    return dateRegex.test(date);
  }

  defaultMessage() {
    return answers.error.invalidDateFormat;
  }
}
