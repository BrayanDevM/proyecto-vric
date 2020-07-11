import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {
  constructor(private usuario$: UsuarioService) {}

  canActivate(): Promise<boolean> | boolean {
    // tomamos el token del usuario
    const token = this.usuario$.token;
    // lo convertimos en un arreglo para obtener la fecha de expiración
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirado = this.comprobarExpiracion(payload.exp);

    // Si ya pasó la fecha de expiración cierra sesión
    if (expirado) {
      this.usuario$.logout();
      return false;
    }
    // Si no ha expirado, comprobamos si debemos renovar el token
    return this.debeRenovarToken(payload.exp);
  }

  comprobarExpiracion(fechaExpiracion: number) {
    // tomamos la fecha actual en segundos
    const ahora = new Date().getTime() / 1000;

    // Si ya pasó la fecha de expiración
    if (fechaExpiracion < ahora) {
      return true;
    } else {
      return false;
    }
  }

  debeRenovarToken(fechaExpiracion: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fechaExpiracion * 1000);
      /*
       * Para mayor seguridad podemos traer la fecha desde la base de datos
       * para que el usuario no pueda alterar la fecha del sistema
       */
      const ahora = new Date();
      // a la fecha actual agregale 1 hora
      // Es decir, validaremos que falte una hora para que el token venza
      ahora.setTime(ahora.getTime() + 1 * 60 * 60 * 1000);
      // Si falta más de una hora, no pasa nada
      if (tokenExp.getTime() > ahora.getTime()) {
        // console.log('Falta más de una hora para que el token expire');
        resolve(true);
      } else {
        // Si falta menos de una hora, renovamos el token
        this.usuario$.renovarToken().subscribe(
          () => {
            // console.log('Token expiraba en menos de una hora, Renovado!');
            resolve(true);
          },
          () => {
            this.usuario$.logout();
            reject(false);
          }
        );
      }
    });
  }
}
