import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit, OnDestroy {
  contratos: Contrato[] = [];
  tablaColumnas: string[] = ['codigo', 'eas', 'nit', 'regional', 'cupos'];
  tablaData: MatTableDataSource<any>;
  numRegistros = 0;
  abrirSidenav = false;
  puedeCrear = false;

  // variables para almacenar subscripción y poder desuscribirnos
  contratoNuevo: Subscription;
  contratoEliminado: Subscription;
  contratoActualizado: Subscription;

  constructor(
    private usuario$: UsuarioService,
    public contratos$: ContratosService,
    private router: Router
  ) {
    this.comprobarPermisos();
  }

  ngOnInit() {
    this.obtenerContratos();
    this.subsContratoNuevo();
    this.subsContratoEliminado();
    this.subsContratoEActualizado();
  }

  ngOnDestroy() {
    this.desuscribir();
  }

  obtenerContratos() {
    this.contratos$.obtenerContratos().subscribe((contratos: Contrato[]) => {
      this.contratos = contratos;
      this.numRegistros = contratos.length;
      this.tablaData = new MatTableDataSource(this.contratos);
    });
  }

  crear() {
    this.router.navigate(['contratos/crear']);
  }

  verContrato(id?: string) {
    this.router.navigate(['contratos/contrato', id]);
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
  subsContratoNuevo(): void {
    this.contratoNuevo = this.contratos$.contratoNuevo$.subscribe(
      (contrato: Contrato) => {
        this.contratos.push(contrato);
        this.tablaData = new MatTableDataSource(this.contratos);
        this.numRegistros++;
      }
    );
  }

  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Eliminamos el contrato del arreglo, actualizamos tabla y restamos 1 al contador
   */
  subsContratoEliminado(): void {
    this.contratoEliminado = this.contratos$.contratoEliminado$.subscribe(
      (id: string) => {
        const i = this.contratos.findIndex(contrato => contrato._id === id);
        this.contratos.splice(i, 1);
        this.tablaData = new MatTableDataSource(this.contratos);
        this.numRegistros--;
      }
    );
  }
  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un contrato editado.
   * Eliminamos el contrato del arreglo, actualizamos tabla.
   */
  subsContratoEActualizado(): void {
    this.contratoActualizado = this.contratos$.contratoActualizado$.subscribe(
      (contratoAct: Contrato) => {
        const i = this.contratos.findIndex(
          contrato => contrato._id === contratoAct._id
        );
        this.contratos.splice(i, 1, contratoAct);
        this.tablaData = new MatTableDataSource(this.contratos);
      }
    );
  }

  // Nos desuscribimos para mejorar performance
  desuscribir(): void {
    this.contratoNuevo.unsubscribe();
    this.contratoEliminado.unsubscribe();
    this.contratoActualizado.unsubscribe();
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
