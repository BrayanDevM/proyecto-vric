import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Uds } from '../models/uds.model';
import { Config } from '../config/config';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UdsService {
  uds: Uds[];
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/uds';

  constructor(
    private usuario$: UsuarioService,
    private http: HttpClient,
    private router: Router
  ) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerUds() {
    return this.http.get(this.API_URL + `?token=${this.token}`);
  }

  obtenerUnidad(id: string) {
    return this.http.get(this.API_URL + `/unidad/${id}?token=${this.token}`);
  }

  crearUds(uds: Uds) {
    return this.http.post(this.API_URL + `?token=${this.token}`, uds).pipe(
      map((resp: any) => {
        if (resp.ok === true) {
          Swal.fire({
            title: 'Unidad de Servicio',
            html: `Unidad de servicio <b>${uds.nombre}</b> creada correctamente`,
            icon: 'success'
          });
        }
        return resp;
      })
    );
  }

  actualizarUds(uds: Uds) {
    return this.http
      .put(this.API_URL + `/${uds._id}?token=${this.token}`, uds)
      .pipe(
        map((resp: any) => {
          if (resp.ok === true) {
            Swal.fire({
              title: 'Unidad de Servicio',
              html: `Unidad de servicio <b>${uds.nombre}</b> actualizada`,
              icon: 'success'
            });
          }
          return resp;
        })
      );
  }

  eliminarUds(uds: Uds) {
    return this.http.delete(this.API_URL + `/${uds._id}?token=${this.token}`);
  }
}
