import { AbstractControl } from '@angular/forms';
declare const moment: any;

export function ValidarRC(
  control: AbstractControl
): { [key: string]: any } | null {
  const hoy = moment();
  const edadAnios = hoy.diff(control.value, 'years');
  if (control.parent) {
    if (
      (control.parent.value.tipoDoc === 'TI' && edadAnios < 7) ||
      (control.parent.value.tipoDoc === 'CC' && edadAnios < 7)
    ) {
      return { tipoDocRcInvalido: true };
    }
    return null;
  }
}

export function ValidarTI(
  control: AbstractControl
): { [key: string]: any } | null {
  const hoy = moment();
  const edadAnios = hoy.diff(control.value, 'years');
  if (control.parent) {
    if (
      (control.parent.value.tipoDoc === 'RC' &&
        edadAnios >= 7 &&
        edadAnios < 18) ||
      (control.parent.value.tipoDoc === 'CC' &&
        edadAnios >= 7 &&
        edadAnios < 18)
    ) {
      return { tipoDocTiInvalido: true };
    }
    return null;
  }
}

export function ValidarCC(
  control: AbstractControl
): { [key: string]: any } | null {
  const hoy = moment();
  const edadAnios = hoy.diff(control.value, 'years');
  if (control.parent) {
    if (
      (control.parent.value.tipoDoc === 'RC' && edadAnios > 18) ||
      (control.parent.value.tipoDoc === 'TI' && edadAnios > 18)
    ) {
      return { tipoDocCcInvalido: true };
    }
    return null;
  }
}
