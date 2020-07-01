import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private ususario$: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    if (this.ususario$.usuario.rol === 'ADMIN') {
      // console.log('eres admin :D');
      return true;
    } else {
      // console.error('No eres admin :D');
      Swal.fire({
        title: 'Acceso no autorizado',
        text:
          'Has intentado acceder a un sitio no autorizado, se ha cerrado la sesión',
        icon: 'error'
      });
      this.ususario$.logout();
      return false;
    }
  }
}
