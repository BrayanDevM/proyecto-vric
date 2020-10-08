import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config/config';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  API_URL = Config.REST.PRINCIPAL.URL + '/buscar';

  constructor(private http: HttpClient) {}

  buscarTodos(criterio: string) {
    return this.http.get(this.API_URL + `/todos/${criterio}`);
  }

  buscarEnColeccion(nombreColeccion: string, criterio: string) {
    return this.http.get(
      this.API_URL + `/coleccion/${nombreColeccion}/${criterio}`
    );
  }
}
