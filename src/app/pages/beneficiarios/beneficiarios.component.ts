import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { Uds } from 'src/app/models/uds.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.css']
})
export class BeneficiariosComponent implements OnInit {
  // ng-select -----------------
  estados: NgOption = [
    { value: 'Pendiente vincular', label: 'Pendiente vincular' },
    { value: 'Pendiente desvincular', label: 'Pendiente desvincular' },
    // { value: 'Vinculado', label: 'Vinculado' },
    { value: 'Dato sensible', label: 'Dato sensible' },
    { value: 'Concurrencia', label: 'Concurrencia' },
    { value: 'Desvinculado', label: 'Desvinculado' }
  ];
  disableRol = false;
  // ---------------------------
  usuario: Usuario;
  query = '';
  udsAsignadas: Uds[] = [];
  cargandoUdsAsignadas = false;
  unidadSeleccionada: string;
  // Segregación de beneficiarios
  beneficiarios: Beneficiario[] = [];
  pendientesVincular: number;
  pendientesDesvincular: number;
  datosSensibles: number;
  concurrencias: number;
  vinculados: number;
  desvinculados: number;

  cargandoListado = false;

  mostrarPorUds = false;
  mostrarPorEstado = false;
  estadoSeleccionado: string;

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
  tablaDataPendientes: MatTableDataSource<any>;
  tablaDataDS: MatTableDataSource<any>;
  tablaDataVinculados: MatTableDataSource<any>;
  tablaDataDesvinculados: MatTableDataSource<any>;

  numRegistros = 0;
  abrirSidenav = false;
  udsFiltradas = false;

  rutaHijaActiva = false;

  udsValue = null;

  @ViewChild('udsSelect') selectUds: ElementRef;

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService,
    private router: Router
  ) {
    this.usuario = this.usuario$.usuario;
    if (this.usuario.rol === 'DOCENTE') {
      this.disableRol = true;
    }
    this.obtenerInfoRuta().subscribe((udsId: string) => {
      if (udsId !== undefined) {
        this.udsValue = udsId;
      } else {
        this.udsValue = null;
      }
    });
  }

  ngOnInit() {
    this.obtenerUds();
  }

  verBeneficiario(id: string) {
    this.router.navigate(['beneficiarios/ver', id]);
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.udsId)
    );
  }

  filtrarTabla(event: Event) {
    const criterioBusqueda = (event.target as HTMLInputElement).value;
    this.beneficiarios$.inputSearch$.emit(criterioBusqueda);
    // this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
  }

  obtenerUds() {
    switch (this.usuario.rol) {
      case 'ADMIN':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'GESTOR':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'COORDINADOR':
        this.query = `coordinador=${this.usuario._id}`;
        break;
      default:
        this.query = `docentes=${this.usuario._id}`;
        break;
    }
    // Si ya ha consultado una vez sólo toma los datos del LS
    const udsEnLocal = localStorage.getItem('udsAsignadas');
    if (udsEnLocal !== null) {
      this.udsAsignadas = JSON.parse(udsEnLocal);
    } else {
      this.uds$.obtenerUds(this.query).subscribe((resp: any) => {
        if (resp.ok) {
          this.udsAsignadas = resp.uds;
          localStorage.setItem(
            'udsAsignadas',
            JSON.stringify(this.udsAsignadas)
          );
        }
      });
    }
  }

  obtenerUds_beneficiarios_responsables(udsId: string) {
    this.router.navigate(['beneficiarios/uds', udsId]);
    // this.selectEstado.nativeElement.value = null;
    // Traemos y guaramos en arreglos
    // this.uds$
    //   .obtenerUnidad_beneficiarios_responsables(id)
    //   .subscribe((resp: any) => {
    //     this.beneficiarios = resp.unidad.beneficiarios;
    //     this.contarEstados(this.beneficiarios);
    //     this.tablaData = new MatTableDataSource(this.beneficiarios);
    //   });
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

  // obtenerBeneficiariosPorEstado($event: any) {
  //   let estado: string;
  //   if (typeof $event === 'string') {
  //     estado = $event;
  //   } else {
  //     estado = $event.value;
  //   }
  //   this.selectUds.handleClearClick();
  //   this.selectEstado.focus();
  //   if ($event === undefined) {
  //     this.beneficiariosPorEstado = [];
  //     return;
  //   }
  //   this.estadoSeleccionado = estado;
  //   this.cargandoListado = true;
  //   this.beneficiarios$
  //     .obtenerBeneficiarios_responsables(`estado=${estado}`)
  //     .subscribe((resp: any) => {
  //       console.log(resp);
  //       if (resp.ok) {
  //         this.beneficiariosPorEstado = resp.beneficiarios;
  //         this.cargandoListado = false;
  //         this.mostrarPorEstado = true;
  //         this.mostrarPorUds = false;
  //       } else {
  //         this.cargandoListado = false;
  //         this.mostrarPorEstado = true;
  //         this.mostrarPorUds = false;
  //       }
  //     });
  // }

  // actualizarListado(realizaCambio?: boolean) {
  //   if (realizaCambio) {
  //     if (this.mostrarPorEstado) {
  //       // cambiar backend
  //       this.obtenerBeneficiariosPorEstado(this.estadoSeleccionado);
  //     } else {
  //       this.obtenerUds_beneficiarios_responsables(this.unidadSeleccionada);
  //     }
  //   }
  // }
}
