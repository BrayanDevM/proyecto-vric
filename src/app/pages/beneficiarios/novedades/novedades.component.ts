import { Component, OnInit } from '@angular/core';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  usuario: any;
  udsAsignadas: Uds[];

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private cookie$: CookieService
  ) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.obtenerUds();
  }

  obtenerUds() {
    const udsEnLocal = localStorage.getItem('udsAsignadas');
    if (udsEnLocal !== null) {
      // Si ya ha consultado una vez sólo toma los datos del LS
      this.udsAsignadas = JSON.parse(udsEnLocal);
    } else {
      const arreglo = [];
      let contador = 0;
      this.usuario.uds.forEach((unidadId: string) => {
        this.uds$.obtenerUnidad(unidadId).subscribe((resp: any) => {
          arreglo.push(resp.unidad);
          contador++;
          if (contador === this.usuario.uds.length) {
            this.udsAsignadas = arreglo;
            console.log(this.udsAsignadas);
            // Guarda los datos de UDS asignadas en LS y no volver a consultar
            localStorage.setItem(
              'udsAsignadas',
              JSON.stringify(this.udsAsignadas)
            );
          }
        });
      });
    }
  }
}
