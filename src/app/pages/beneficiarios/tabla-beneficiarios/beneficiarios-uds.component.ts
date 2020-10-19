import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class BeneficiariosUdsComponent implements OnInit {
  // variables de configuración
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
  abrirSidenav = false;
  // variables de uso
  beneficiarios: Beneficiario[] = [];
  tablaData: MatTableDataSource<any>;
  pendientesVincular: number;
  pendientesDesvincular: number;
  datosSensibles: number;
  concurrencias: number;
  vinculados: number;
  desvinculados: number;
  criterioBusqueda = '';

  // elementos DOM
  @ViewChild('buscar') iBuscar: ElementRef;

  // observables
  nuevaBusqueda: Subscription;

  constructor(
    private router: Router,
    protected ar: ActivatedRoute,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService,
    private dialog: MatDialog
  ) {
    this.obtenerInfoRuta().subscribe(udsId => {
      if (udsId !== undefined) {
        this.obtenerUds_beneficiarios_responsables(udsId);
      }
    });
  }

  ngOnInit(): void {}

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
        this.beneficiarios = resp.unidad.beneficiarios;
        this.contarEstados(this.beneficiarios);
        this.tablaData = new MatTableDataSource(this.beneficiarios);
        this.beneficiarios$.subtituloPag$.emit(
          `${this.beneficiarios.length} Beneficiarios`
        );
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

  openDialog(beneficiario: Beneficiario) {
    this.dialog.open(BeneficiarioComponent, {
      minWidth: '640px',
      data: beneficiario
    });
  }

  filtrarTabla(event: Event, texto?: string) {
    let criterioBusqueda: string;
    if (texto !== undefined) {
      this.iBuscar.nativeElement.value = texto;
      this.criterioBusqueda = texto;
      criterioBusqueda = texto.trim().toLowerCase();
    } else {
      criterioBusqueda = (event.target as HTMLInputElement).value;
      this.criterioBusqueda = criterioBusqueda;
    }
    this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
    this.beneficiarios$.subtituloPag$.emit(
      `${this.tablaData.filteredData.length} Beneficiarios`
    );
  }
}
