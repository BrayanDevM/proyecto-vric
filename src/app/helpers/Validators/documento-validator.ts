import { AbstractControl } from '@angular/forms';

/**
 * Función que valida que el documento de un beneficiario tenga
 * entre 8 (93.152.677) y 10 dígitos (1.110.556.123)
 * + 18 Valor recibido de documento aleatorio para SD
 * @param control campo de un formulario reactivo
 */
export function ValidarDocumento(
  control: AbstractControl
): { [key: string]: any } | null {
  if (
    (control.value && control.value.length === 8) ||
    (control.value && control.value.length === 10) ||
    (control.value && control.value.length === 18)
  ) {
    return null;
  }
  return { documentoInvalido: true };
}

/**
 * Función que valida que el documento de un beneficiario tenga
 * entre 8 (93.152.677) y 10 dígitos (1.110.556.123)
 * + 7 dígitos (7.123.123) para adultos mayores
 * + 18 Valor recibido de documento aleatorio para SD
 * @param control campo de un formulario reactivo
 */
export function ValidarDocumentoAntiguo(
  control: AbstractControl
): { [key: string]: any } | null {
  if (
    (control.value && control.value.length === 7) ||
    (control.value && control.value.length === 8) ||
    (control.value && control.value.length === 10) ||
    (control.value && control.value.length === 18)
  ) {
    return null;
  }
  return { documentoInvalido: true };
}
