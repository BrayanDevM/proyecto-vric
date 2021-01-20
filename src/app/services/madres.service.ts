import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Madre } from '../models/madre.model';

@Injectable({
  providedIn: 'root'
})
export class MadresService {
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/madres';

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerMadres(query = '') {
    return this.http.get(this.API_URL + `?${query}`);
  }

  // No implementado
  // obtenerMadre(id: string) {
  //   return this.http.get(this.API_URL + `/${id}?token=${this.token}`);
  // }

  actualizarMadre(madre: Madre) {
    return this.http.put(
      this.API_URL + `/${madre._id}?token=${this.token}`,
      madre
    );
  }
}
