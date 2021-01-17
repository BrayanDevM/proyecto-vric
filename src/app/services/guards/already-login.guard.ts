import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoginGuard implements CanActivate {
  constructor(private ususario$: UsuarioService, private router: Router) {}

  /**
   * Comprueba si el usuario ya ha iniciado sesión en página login
   * si ya ha iniciado redirecciona a dashboard
   */
  canActivate(): boolean {
    if (!this.ususario$.haIniciadoSesion()) {
      return true;
    } else {
      // Si usuario es docente envía a Dashboard de su uds (primera, en caso de varias)
      this.ususario$.usuario.rol === 'DOCENTE'
        ? this.router.navigate([
            '/dashboard/uds',
            this.ususario$.usuario.uds[0]
          ])
        : this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
