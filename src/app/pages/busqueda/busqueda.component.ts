import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Config } from 'src/app/config/config';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { Uds } from 'src/app/models/uds.model';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  usuario: Usuario;
  criterioBusqueda: any;
  beneficiarios: Beneficiario[] = [];
  uds: Uds[] = [];
  respBeneficiarios: RespBeneficiario[] = [];

  constructor(
    private ar: ActivatedRoute,
    private http: HttpClient,
    private usuarios$: UsuarioService
  ) {
    this.ar.params.subscribe((params: any) => {
      this.criterioBusqueda = params.criterio;
      this.buscar(this.criterioBusqueda);
    });
  }

  ngOnInit() {
    this.usuario = this.usuarios$.usuario;
  }

  buscar(criterio: any) {
    const url = Config.REST.PRINCIPAL.URL + `/buscar/todos/${criterio}`;
    this.http.get(url).subscribe((resp: any) => {
      this.beneficiarios = resp.beneficiarios;
      this.uds = resp.uds;
      this.respBeneficiarios = resp.respBeneficiarios;
    });
  }
}
