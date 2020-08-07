import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { Router } from '@angular/router';
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
  cantRregistros = 0;
  cargando = false;
  openSidebar = false;
  nuevoContrato: Subscription;
  contratoEliminado: Subscription;

  constructor(public contratos$: ContratosService, private router: Router) {}

  ngOnInit() {
    this.obtenerContratos();

    this.nuevoContrato = this.contratos$.nuevoContrato$.subscribe(contrato => {
      this.contratos.push(contrato);
      this.tablaData = new MatTableDataSource(this.contratos);
      this.cantRregistros++;
    });

    this.contratoEliminado = this.contratos$.contratoEliminado$.subscribe(
      id => {
        const i = this.contratos.findIndex(contrato => contrato._id === id);
        this.contratos.splice(i, 1);
        this.tablaData = new MatTableDataSource(this.contratos);
        this.cantRregistros--;
      }
    );
  }

  ngOnDestroy() {
    this.nuevoContrato.unsubscribe();
  }

  obtenerContratos() {
    this.cargando = true;
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok) {
        this.contratos = resp.contratos;
        this.cantRregistros = resp.registros;
        this.tablaData = new MatTableDataSource(this.contratos);
      } else {
        this.cargando = false;
      }
    });
  }

  crear() {
    // this.router.navigate(['/contratos/crear']);
    this.router.navigate(['contratos', { outlets: { nuevo: 'crear' } }]);
  }

  filtrarTabla(event: Event) {
    const criterioBusqueda = (event.target as HTMLInputElement).value;
    this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
  }

  verContrato(id?: string) {
    this.router.navigate(['contratos', { outlets: { contrato: [id] } }]);
  }
}
