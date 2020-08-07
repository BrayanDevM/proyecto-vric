import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

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

  // variables para almacenar subscripción y poder desuscribirnos
  contratoNuevo: Subscription;
  contratoEliminado: Subscription;

  constructor(public contratos$: ContratosService, private router: Router) {}

  ngOnInit() {
    this.obtenerContratos();
    this.subsContratoNuevo();
    this.subsContratoEliminado();
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
    this.router.navigate(['contratos', { outlets: { nuevo: 'crear' } }]);
  }

  verContrato(id?: string) {
    this.router.navigate(['contratos', { outlets: { contrato: [id] } }]);
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
    this.contratoNuevo = this.contratos$.nuevoContrato$.subscribe(
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

  // Nos desuscribimos para mejorar performance
  desuscribir(): void {
    this.contratoNuevo.unsubscribe();
    this.contratoEliminado.unsubscribe();
  }
}
