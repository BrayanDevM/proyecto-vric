import { Component, OnInit, ViewChild } from '@angular/core';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import {
  alertDanger,
  alertSuccess,
  alertError
} from 'src/app/helpers/swal2.config';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
  tablaColumnas: string[] = ['codigo', 'eas', 'nit', 'regional', 'cupos'];
  tablaData: MatTableDataSource<any>;
  cantRregistros = 0;
  cargando = false;
  openSidebar = false;

  constructor(public contratos$: ContratosService, private router: Router) {}

  ngOnInit() {
    this.obtenerContratos();
  }

  obtenerContratos() {
    this.cargando = true;
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok) {
        this.cantRregistros = resp.registros;
        this.tablaData = new MatTableDataSource(resp.contratos);
      } else {
        this.cargando = false;
      }
    });
  }

  crear() {
    this.router.navigate(['/contratos/crear']);
  }

  filtrarTabla(event: Event) {
    const criterioBusqueda = (event.target as HTMLInputElement).value;
    this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
  }

  verContrato(id?: string) {
    this.router.navigate(['contratos', { outlets: { contrato: [id] } }]);
  }

  eliminarContrato(contrato: Contrato) {
    alertDanger
      .fire({
        title: 'Eliminar contrato',
        html: `¿Estás seguro que deseas eliminar el contrato <b>${contrato.codigo}</b>?, esta acción no puede deshacerse`,
        confirmButtonText: 'Estoy seguro, eliminar'
      })
      .then(result => {
        if (result.value) {
          this.contratos$.eliminarContrato(contrato).subscribe((resp: any) => {
            if (resp.ok) {
              this.obtenerContratos();
              alertSuccess.fire({
                title: 'Contrato eliminado'
              });
            } else {
              alertError.fire({
                title: 'Eliminar contrato',
                text:
                  'No se ha podido eliminar el contrato, intentalo nuevamente'
              });
            }
          });
        }
      });
  }
}
