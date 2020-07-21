import Swal from 'sweetalert2/src/sweetalert2.js';

const alertDanger = Swal.mixin({
  icon: 'warning',
  customClass: {
    confirmButton: 'btn btn-danger',
    cancelButton: 'btn btn-light'
  },
  backdrop: 'rgba(0, 0, 0, .048)',
  reverseButtons: true,
  focusConfirm: false,
  showCancelButton: true,
  cancelButtonText: 'Cancelar',
  buttonsStyling: false
});

const alertConfirm = Swal.mixin({
  icon: 'warning',
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-light'
  },
  backdrop: 'rgba(0, 0, 0, .048)',
  reverseButtons: true,
  focusConfirm: false,
  showCancelButton: true,
  cancelButtonText: 'Cancelar',
  buttonsStyling: false
});

const alertSuccess = Swal.mixin({
  icon: 'success',
  backdrop: 'rgba(0, 0, 0, .048)',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
});

const alertError = Swal.mixin({
  icon: 'error',
  customClass: {
    confirmButton: 'btn btn-primary'
  },
  backdrop: 'rgba(0, 0, 0, .048)',
  showConfirmButton: true,
  confirmButtonText: 'Entendido',
  buttonsStyling: false
});

export { alertDanger, alertSuccess, alertError, alertConfirm };
