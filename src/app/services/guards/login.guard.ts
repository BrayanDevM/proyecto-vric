import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private ususario$: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    if (this.ususario$.haIniciadoSesion()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
