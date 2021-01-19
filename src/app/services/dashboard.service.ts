import { Injectable, EventEmitter } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/main-dashboard';

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerDatos(query = '') {
    return this.http.get(`${this.API_URL}?${query}&token=${this.token}`);
  }
}
