import { Component, OnInit } from '@angular/core';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
declare const moment: any;

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  usuario: Usuario;
  udsAsignadas: Uds[];
  query = '';
  semanaActual: any;
  proximoCambioGestantes: any;

  constructor(private usuario$: UsuarioService, private uds$: UdsService) {
    this.semanaActual = this.weekOfMonth(moment());
    // console.log(this.semanaActual);
    if (this.semanaActual === 1) {
      this.proximoCambioGestantes = 'esta semana';
    } else {
      this.proximoCambioGestantes =
        'el mes siguiente, ' +
        moment()
          .add(1, 'M')
          .format('MMMM');
    }
  }

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.obtenerUds();
  }

  weekOfMonth(m) {
    return (
      m.week() -
      moment(m)
        .startOf('month')
        .week() +
      1
    );
  }

  obtenerUds() {
    switch (this.usuario.rol) {
      case 'ADMIN':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'GESTOR':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'COORDINADOR':
        this.query = `coordinador=${this.usuario._id}`;
        break;
      default:
        this.query = `docentes=${this.usuario._id}`;
        break;
    }
    // Si ya ha consultado una vez sólo toma los datos del LS
    const udsEnLocal = localStorage.getItem('udsAsignadas');
    if (udsEnLocal !== null) {
      this.udsAsignadas = JSON.parse(udsEnLocal);
    } else {
      this.uds$.obtenerUds(this.query).subscribe((resp: any) => {
        if (resp.ok) {
          this.udsAsignadas = resp.uds;
          localStorage.setItem(
            'udsAsignadas',
            JSON.stringify(this.udsAsignadas)
          );
        }
      });
    }
  }
}
