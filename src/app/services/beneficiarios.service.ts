import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Beneficiario } from '../models/beneficiario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config/config';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariosService {
  usuario: Usuario;
  token: string;
  benficiario: Beneficiario;
  API_URL = Config.REST.PRINCIPAL.URL + '/beneficiarios';

  constructor(
    private usuario$: UsuarioService,
    private http: HttpClient,
    private router: Router
  ) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerBeneficiarios(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL + `?token=${this.token}`);
    } else {
      return this.http.get(this.API_URL + `?${query}&token=${this.token}`);
    }
  }

  obtenerBeneficiarios_responsables(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL + `/responsables?token=${this.token}`);
    } else {
      return this.http.get(
        this.API_URL + `/responsables?${query}&token=${this.token}`
      );
    }
  }

  obtenerBeneficiario(id: string) {
    return this.http.get(this.API_URL + `/${id}?token=${this.token}`);
  }

  obtenerBeneficiario_responsables(id: string) {
    return this.http.get(
      this.API_URL + `/${id}/responsables?token=${this.token}`
    );
  }

  crearBeneficiario(form: any) {
    return this.http.post(this.API_URL + `?token=${this.token}`, form).pipe(
      map((resp: any) => {
        if (resp.ok === true) {
          Swal.fire({
            title: 'Reportar ingreso',
            html: `El beneficiario fue reportado correctamente`,
            icon: 'success'
          });
          return resp;
        }
      }),
      catchError(err => {
        console.log(err);
        if (err.status === 400) {
          if (err.error.error.message === undefined) {
            err.error.error.message = '';
          }
          Swal.fire({
            title: 'Reportar ingreso',
            html: `${err.error.mensaje}.</br>${err.error.error.message} `,
            icon: 'error'
          });
        }
        return throwError(err);
      })
    );
    // El bakcend toma cada uno y los crea en su respectiva colección
  }

  actualizarBeneficiario(beneficiario: Beneficiario) {
    return this.http.put(
      this.API_URL + `/${beneficiario._id}?token=${this.token}`,
      beneficiario
    );
  }

  eliminarBeneficiario(beneficiario: Beneficiario) {
    return this.http.delete(
      this.API_URL + `/${beneficiario._id}?token=${this.token}`
    );
  }
}
