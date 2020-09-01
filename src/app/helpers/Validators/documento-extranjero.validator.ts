import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida si en registro un beneficiario extranjero es puesto con
 * un documento colombiano y muestra error (debe ser SD o PEP)
 * SD: Sin documento
 * PEP: Permiso Especial de Permanencia
 */
export function documentoExtranjero(
  campoTipoDoc: string,
  campoPaisNacimiento: string
): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const campoDoc = group.controls[campoTipoDoc];
    const campoPais = group.controls[campoPaisNacimiento];

    if (
      (campoPais.value !== 'Colombia' && campoDoc.value === 'RC') ||
      (campoPais.value !== 'Colombia' && campoDoc.value === 'TI') ||
      (campoPais.value !== 'Colombia' && campoDoc.value === 'CC')
    ) {
      campoPais.setErrors({ debeSerDocExtranjero: true });
    } else {
      campoPais.setErrors(null);
    }
    return;
  };
}
