import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
declare const moment: any;

export function debeSerRC(
  campoTipoDoc: string,
  campoFechaNacimiento: string
): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const campoDoc = group.controls[campoTipoDoc];
    const campoNacimiento = group.controls[campoFechaNacimiento];

    const hoy = moment();
    const edadAnios = hoy.diff(campoNacimiento.value, 'years');

    if (
      (edadAnios < 7 && campoDoc.value === 'TI') ||
      (edadAnios < 7 && campoDoc.value === 'CC')
    ) {
      campoDoc.setErrors({ debeSerRC: true });
    } else {
      campoDoc.setErrors(null);
    }
    return;
  };
}

export function debeSerTI(
  campoTipoDoc: string,
  campoFechaNacimiento: string
): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const campoDoc = group.controls[campoTipoDoc];
    const campoNacimiento = group.controls[campoFechaNacimiento];

    const hoy = moment();
    const edadAnios = hoy.diff(campoNacimiento.value, 'years');

    if (
      (edadAnios >= 7 && edadAnios < 18 && campoDoc.value === 'RC') ||
      (edadAnios >= 7 && edadAnios < 18 && campoDoc.value === 'CC')
    ) {
      campoDoc.setErrors({ debeSerTI: true });
    } else {
      campoDoc.setErrors(null);
    }
    return;
  };
}

export function debeSerCC(
  campoTipoDoc: string,
  campoFechaNacimiento: string
): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const campoDoc = group.controls[campoTipoDoc];
    const campoNacimiento = group.controls[campoFechaNacimiento];

    const hoy = moment();
    const edadAnios = hoy.diff(campoNacimiento.value, 'years');

    if (
      (edadAnios >= 18 && campoDoc.value === 'TI') ||
      (edadAnios >= 18 && campoDoc.value === 'RC')
    ) {
      campoDoc.setErrors({ debeSerCC: true });
    } else {
      campoDoc.setErrors(null);
    }
    return;
  };
}
