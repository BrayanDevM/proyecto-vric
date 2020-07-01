import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

// custom validator para verificar que dos campos coincidan
export function debenCoincidir(
  controlName: string,
  controlName2: string
): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const campo1 = group.controls[controlName];
    const campo2 = group.controls[controlName2];
    if (campo1.value === campo2.value) {
      campo2.setErrors(null);
    } else {
      campo2.setErrors({ noSonIguales: true });
    }
    return;
  };
}
