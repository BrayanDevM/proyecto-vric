import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { RespBeneficiario } from '../models/respBeneficiario.model';

@Injectable({
  providedIn: 'root'
})
export class RespBeneficiariosService {
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/respBeneficiarios';

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerResponsables(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL);
    } else {
      return this.http.get(this.API_URL + `?${query}`);
    }
  }

  obtenerResponsable(id: string) {
    return this.http.get(this.API_URL + `/${id}?token=${this.token}`);
  }

  actualizarResponsable(responsable: RespBeneficiario) {
    return this.http.put(
      this.API_URL + `/${responsable._id}?token=${this.token}`,
      responsable
    );
  }
}
