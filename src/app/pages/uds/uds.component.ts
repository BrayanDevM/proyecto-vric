import { Component, OnInit, OnDestroy } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PageLoadingService } from 'src/app/services/page-loading.service';

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
  udsFiltradas = false;

  // variables para almacenar subscripción y poder desuscribirnos
  udsNueva: Subscription;
  udsEliminada: Subscription;
  udsActualizada: Subscription;

  puedeCrear = false;

  constructor(
    private pageLoading$: PageLoadingService,
    private usuario$: UsuarioService,
    public uds$: UdsService,
    private router: Router
  ) {
    this.comprobarPermisos();
  }

  ngOnInit(): void {
    this.obtenerUds();
    this.subsUdsNueva();
    this.subsUdsEliminada();
    this.subsUdsActualizada();
    this.pageLoading$.loadingPages.emit(false);
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

  obtenerUdsFiltro(query: string) {
    this.udsFiltradas = true;
    this.uds$.obtenerUds(query).subscribe((resp: any) => {
      this.uds = resp.uds;
      this.numRegistros = this.uds.length;
      this.tablaData = new MatTableDataSource(this.uds);
    });
  }

  removerFiltro() {
    this.udsFiltradas = false;
    this.obtenerUds();
  }

  crear() {
    this.router.navigate(['unidades-de-servicio/crear']);
  }

  verUnidad(id?: string) {
    this.router.navigate(['unidades-de-servicio/unidad', id]);
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

  // permisos para crear
  comprobarPermisos() {
    switch (this.usuario$.usuario.rol) {
      case 'ADMIN':
        this.puedeCrear = true;
        break;
      case 'GESTOR':
        this.puedeCrear = true;
        break;
      default:
        this.puedeCrear = false;
        break;
    }
  }
}
