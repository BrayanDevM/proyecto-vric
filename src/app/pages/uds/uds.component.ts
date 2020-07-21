import { Component, OnInit } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { Router } from '@angular/router';
import {
  alertDanger,
  alertSuccess,
  alertError
} from 'src/app/helpers/swal2.config';

@Component({
  selector: 'app-uds',
  templateUrl: './uds.component.html',
  styleUrls: ['./uds.component.css']
})
export class UdsComponent implements OnInit {
  uds: Uds[] = [];
  registros: number;
  cargando = false;

  constructor(public uds$: UdsService, private router: Router) {}

  ngOnInit() {
    this.obtenerUds();
  }

  obtenerUds() {
    this.cargando = true;
    this.uds$.obtenerUdsSimple().subscribe((resp: any) => {
      if (resp.ok) {
        this.cargando = false;
        this.uds = resp.uds;
        this.registros = resp.registros;
      } else {
        this.cargando = false;
        console.log(resp);
      }
    });
  }

  crearUds() {
    this.router.navigate(['/uds/crear']);
  }

  eliminarUds(uds: Uds) {
    alertDanger
      .fire({
        title: 'Eliminar Unidad De Servicio',
        html: `¿Estás seguro que deseas eliminar la Unidad De Servicio <b>${uds.nombre}</b>?, esta acción no puede deshacerse.`,
        confirmButtonText: 'Estoy seguro, eliminar'
      })
      .then(result => {
        if (result.value) {
          this.uds$.eliminarUds(uds).subscribe((resp: any) => {
            if (resp.ok === true) {
              alertSuccess.fire({
                title: 'Unidad De Sercicio eliminada'
              });
              this.obtenerUds();
            } else {
              alertError.fire({
                title: 'Eliminar Unidad De Servicio',
                text:
                  'No se ha podido eliminar la Unidad De Servicio, intentalo nuevamente'
              });
            }
          });
        }
      });
  }
}
