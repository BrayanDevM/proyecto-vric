import Swal from 'sweetalert2/src/sweetalert2.js';

// Cofnfirmación de que es una acción importante
const alertDanger = Swal.mixin({
  icon: 'warning',
  customClass: {
    confirmButton: 'mat-flat-button mat-button-base mat-primary',
    cancelButton: 'mat-button mat-button-base'
  },
  backdrop: 'rgba(0, 0, 0, .048)',
  reverseButtons: true,
  focusConfirm: false,
  showCancelButton: true,
  cancelButtonText: 'Cancelar',
  buttonsStyling: false
});

// Sólo muestra icono y título
const alertSuccess = Swal.mixin({
  icon: 'success',
  backdrop: 'rgba(0, 0, 0, .048)',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const alertError = Swal.mixin({
  icon: 'error',
  customClass: {
    confirmButton: 'mat-flat-button mat-button-base mat-primary'
  },
  backdrop: 'rgba(0, 0, 0, .048)',
  showConfirmButton: true,
  confirmButtonText: 'Entendido',
  buttonsStyling: false
});

export { alertDanger, alertSuccess, alertError };
