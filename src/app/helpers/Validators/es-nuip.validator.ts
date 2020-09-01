import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

// custom validator para verificar que se registre un documento colombiano
export function esNuip(controlName: string): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const campo = group.controls[controlName];
    let nuip = campo.value.replace('.', '');
    setTimeout(() => {
      nuip = nuip.replace('.', '');
    }, 100);
    console.log(nuip, 'nuip sin puntos');

    // teniendo en cuenta que el NUIP viene con separadores de miles
    if (campo.value.length === 10) {
      console.log(campo.value.length, 'Tiene 10, válido');
      campo.setErrors({ nuipNoValido: true });
      return;
    }
    if (campo.value.length === 13) {
      console.log(campo.value.length, 'Tiene 13, válido');
      campo.setErrors({ nuipNoValido: true });
      return;
    }
    campo.setErrors(null);
    return;
  };
}
