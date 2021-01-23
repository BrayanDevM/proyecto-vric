import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargarArchivosService {
  usuario: Usuario;
  token: string;

  constructor(private usuario$: UsuarioService, private http$: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  importarExcelBeneficiarios(archivo: FormData) {
    const URL = `${Config.REST.PRINCIPAL.URL}/importar-excel?token=${this.token}`;
    return this.http$.post(URL, archivo).pipe(
      map((resp: any) => {
        if (resp.ok) {
          Swal.fire({
            title: 'Importar beneficiarios',
            html: 'Beneficiarios importados correctamente',
            icon: 'success'
          });
        }
        return resp;
      }),
      catchError((err) => {
        if (!err.ok) {
          Swal.fire({
            title: 'Importar beneficiarios',
            html: `${err.message}`,
            icon: 'error'
          });
        }
        return throwError(err);
      })
    );
  }
}
