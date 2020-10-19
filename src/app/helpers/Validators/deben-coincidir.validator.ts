import { AbstractControl } from '@angular/forms';

export function ValidarCoincidencia(
  control: AbstractControl
): { [key: string]: any } | null {
  if (control.parent) {
    // console.log(control.parent.value.password, '<- contraseña');
    // console.log(control.value, '<- confirma');
    if (control.parent.value.password !== control.value) {
      // console.log('no coinciden?');
      return { noCoinciden: true };
    }
    // console.log(control.parent.value.password, '<- contraseña');
    // console.log(control.value, '<- confirma');
    // console.log('coinciden');
    return null;
  }
}
