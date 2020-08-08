import { Component, OnInit, OnDestroy } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { Router } from '@angular/router';
import {
  alertDanger,
  alertSuccess,
  alertError
} from 'src/app/helpers/swal2.config';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-uds',
  templateUrl: './uds.component.html',
  styleUrls: ['./uds.component.css']
})
export class UdsComponent implements OnInit, OnDestroy {
  uds: Uds[] = [];
  tablaColumnas: string[] = [
    'codigo',
    'nombre',
    'ubicacion',
    'cupos',
    'estado',
    'arriendo'
  ];
  tablaData: MatTableDataSource<any>;
  numRegistros = 0;
  abrirSidenav = false;

  // variables para almacenar subscripción y poder desuscribirnos
  udsNueva: Subscription;
  udsEliminada: Subscription;
  udsActualizada: Subscription;

  constructor(public uds$: UdsService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUds();
    this.subsUdsNueva();
    this.subsUdsEliminada();
    this.subsUdsActualizada();
  }

  ngOnDestroy(): void {
    this.desuscribir();
  }

  obtenerUds(): void {
    this.uds$.obtenerUds().subscribe((uds: Uds[]) => {
      this.uds = uds;
      this.numRegistros = uds.length;
      this.tablaData = new MatTableDataSource(this.uds);
    });
  }

  crear() {
    this.router.navigate(['uds', { outlets: { nuevo: 'crear' } }]);
  }

  verUnidad(id?: string) {
    this.router.navigate(['uds', { outlets: { uds: [id] } }]);
  }

  filtrarTabla(event: Event) {
    const criterioBusqueda = (event.target as HTMLInputElement).value;
    this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
  }

  // subscribes
  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Agregamos al final el nuevo contrato, actualizamos tabla y sumamos 1 al contador
   */
  subsUdsNueva(): void {
    this.udsNueva = this.uds$.udsNueva$.subscribe((uds: Uds) => {
      this.uds.push(uds);
      this.tablaData = new MatTableDataSource(this.uds);
      this.numRegistros++;
    });
  }

  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Eliminamos el contrato del arreglo, actualizamos tabla y restamos 1 al contador
   */
  subsUdsEliminada(): void {
    this.udsEliminada = this.uds$.udsEliminada$.subscribe((id: string) => {
      const i = this.uds.findIndex(unidad => unidad._id === id);
      this.uds.splice(i, 1);
      this.tablaData = new MatTableDataSource(this.uds);
      this.numRegistros--;
    });
  }

  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Agregamos al final el nuevo contrato, actualizamos tabla y sumamos 1 al contador
   */
  subsUdsActualizada(): void {
    this.udsActualizada = this.uds$.udsActualizada$.subscribe((uds: Uds) => {
      const i = this.uds.findIndex(unidad => unidad._id === uds._id);
      this.uds.splice(i, 1, uds);
      this.tablaData = new MatTableDataSource(this.uds);
    });
  }

  // Nos desuscribimos para mejorar performance
  desuscribir(): void {
    this.udsNueva.unsubscribe();
    this.udsEliminada.unsubscribe();
    this.udsActualizada.unsubscribe();
  }
}
