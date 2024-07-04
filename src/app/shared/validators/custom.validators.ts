import {AbstractControl, ValidatorFn} from "@angular/forms";
import {CustomError} from "./custom-error.model";
import {REGEXP_PATTERNS} from "../../app.config";

export class CustomValidators {
  static isValidName(): ValidatorFn {
    return (control: AbstractControl): CustomError | null => {
      const value = control.value as string;
      return value && REGEXP_PATTERNS.name.test(value.trim()) ? null : { invalidName: true };
    };
  }

  static dateFormat(): ValidatorFn {
    return (control: AbstractControl): CustomError | null => {
      const value = control.value as string;
      return value && REGEXP_PATTERNS.dateFormat.test(value) ? null : { invalidDateFormat: true };
    };
  }

  static dateComparisonValidator: ValidatorFn = (group: AbstractControl): CustomError | null => {
    const manufactureDate = group.get('manufactureDate');
    const expirationDate = group.get('expirationDate');

    if (manufactureDate?.value && expirationDate?.value) {
      const mDate = new Date(manufactureDate.value);
      const eDate = new Date(expirationDate.value);

      if (eDate < mDate) {
        return { dateInvalid: true };
      }
    }

    return null;
  }
}
