import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UdsService } from 'src/app/services/uds.service';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { MatTableDataSource } from '@angular/material/table';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiarioComponent } from '../beneficiario/beneficiario.component';

@Component({
  selector: 'app-beneficiarios-uds',
  templateUrl: './beneficiarios-uds.component.html',
  styles: []
})
export class BeneficiariosUdsComponent implements OnInit, OnDestroy {
  beneficiarios: Beneficiario[] = [];
  pendientesVincular: number;
  pendientesDesvincular: number;
  datosSensibles: number;
  concurrencias: number;
  vinculados: number;
  desvinculados: number;

  tablaColumnas: string[] = [
    'tipoDoc',
    'documento',
    'nombre1',
    'nombre2',
    'apellido1',
    'apellido2',
    'nacimiento',
    'estado'
  ];
  tablaData: MatTableDataSource<any>;

  nuevaBusqueda: Subscription;
  criterioBusqueda = '';

  abrirSidenav = false;

  constructor(
    private router: Router,
    protected ar: ActivatedRoute,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService,
    private dialog: MatDialog
  ) {
    this.obtenerInfoRuta().subscribe(udsId => {
      console.log(udsId, 'id url uds padre');
      this.obtenerUds_beneficiarios_responsables(udsId);
    });
  }

  ngOnInit(): void {
    this.subsInputSearch();
  }

  ngOnDestroy(): void {
    this.desuscribir();
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.udsId)
    );
  }

  obtenerUds_beneficiarios_responsables(id: string) {
    this.uds$
      .obtenerUnidad_beneficiarios_responsables(id)
      .subscribe((resp: any) => {
        console.log(resp, 'resp');

        this.beneficiarios = resp.unidad.beneficiarios;
        this.contarEstados(this.beneficiarios);
        this.tablaData = new MatTableDataSource(this.beneficiarios);
      });
  }

  contarEstados(beneficiarios: Beneficiario[]) {
    this.pendientesVincular = 0;
    this.pendientesDesvincular = 0;
    this.datosSensibles = 0;
    this.concurrencias = 0;
    this.vinculados = 0;
    this.desvinculados = 0;
    beneficiarios.forEach(b => {
      switch (b.estado) {
        case 'Pendiente vincular':
          this.pendientesVincular++;
          break;
        case 'Pendiente desvincular':
          this.pendientesDesvincular++;
          break;
        case 'Dato sensible':
          this.datosSensibles++;
          break;
        case 'Concurrencia':
          this.concurrencias++;
          break;
        case 'Vinculado':
          this.vinculados++;
          break;
        default:
          this.desvinculados++;
          break;
      }
    });
  }

  // verBeneficiario(id: string) {
  //   this.router.navigate(['beneficiario', id], { relativeTo: this.ar });
  // }

  openDialog(beneficiario: Beneficiario) {
    this.dialog.open(BeneficiarioComponent, {
      data: beneficiario
    });
  }

  subsInputSearch() {
    this.nuevaBusqueda = this.beneficiarios$.inputSearch$.subscribe(
      (criterioBusqueda: string) => {
        this.criterioBusqueda = criterioBusqueda;
        this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
      }
    );
  }

  desuscribir() {
    this.nuevaBusqueda.unsubscribe();
  }
}
