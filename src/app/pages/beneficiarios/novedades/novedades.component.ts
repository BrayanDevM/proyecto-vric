import { Component, OnInit } from '@angular/core';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  usuario: any;
  udsAsignadas: Uds[];

  constructor(private usuario$: UsuarioService, private uds$: UdsService) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.obtenerUds();
  }

  obtenerUds() {
    const arreglo = [];
    let contador = 0;
    this.usuario.uds.forEach((unidadId: string) => {
      this.uds$.obtenerUnidad(unidadId).subscribe((resp: any) => {
        arreglo.push(resp.unidad);
        contador++;
        if (contador === this.usuario.uds.length) {
          this.udsAsignadas = arreglo;
        }
      });
    });
  }
}
