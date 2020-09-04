import { AbstractControl } from '@angular/forms';

/**
 * Función que valida que un documento contenga
 * entre 7 (592 26 28) y 10 dígitos (311 507 1561)
 * @param control campo de un formulario reactivo
 */
export function ValidarTelefono(
  control: AbstractControl
): { [key: string]: any } | null {
  if (
    (control.value && control.value.length === 7) ||
    (control.value && control.value.length === 10)
  ) {
    return null;
  }
  return { telefonoInvalido: true };
}
