import { Component, OnInit } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-uds',
  templateUrl: './uds.component.html',
  styleUrls: ['./uds.component.css']
})
export class UdsComponent implements OnInit {
  uds: Uds[] = [];
  registros: number;

  constructor(public uds$: UdsService, private router: Router) {}

  ngOnInit() {
    this.obtenerUds();
  }

  obtenerUds() {
    this.uds$.obtenerUds().subscribe((resp: any) => {
      this.uds = resp.uds;
      this.registros = resp.registros;
      // console.log(this.uds);
    });
  }

  crearUds() {
    this.router.navigate(['/uds/crear']);
  }

  eliminarUds(uds: Uds) {
    Swal.fire({
      title: 'Eliminar',
      html: `¿Estás seguro que deseas eliminar a <b>${uds.nombre}</b>?, esta acción no puede deshacerse`,
      icon: 'warning',
      confirmButtonColor: '#f44234',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.uds$.eliminarUds(uds).subscribe((resp: any) => {
          if (resp.ok === true) {
            Swal.fire({
              title: 'Eliminado',
              text: 'Unidad de Servicio eliminada correctamente',
              icon: 'success'
            });
            this.obtenerUds();
          }
        });
      }
    });
  }
}
