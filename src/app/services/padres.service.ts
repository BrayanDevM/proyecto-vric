import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Padre } from '../models/padre.model';

@Injectable({
  providedIn: 'root'
})
export class PadresService {
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/padres';

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerPadres(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL);
    } else {
      return this.http.get(this.API_URL + `?${query}`);
    }
  }

  // No implementado
  // obtenerMadre(id: string) {
  //   return this.http.get(this.API_URL + `/${id}?token=${this.token}`);
  // }

  actualizarPadre(padre: Padre) {
    return this.http.put(
      this.API_URL + `/${padre._id}?token=${this.token}`,
      padre
    );
  }
}
