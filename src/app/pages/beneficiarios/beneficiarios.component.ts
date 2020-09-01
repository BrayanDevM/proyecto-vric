import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { Uds } from 'src/app/models/uds.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.css']
})
export class BeneficiariosComponent implements OnInit, OnDestroy {
  // variables de configuración
  subtituloPagina = 'Lista de beneficiarios registrados';
  estados = [
    { value: 'Pendiente+vincular', label: 'Pendiente vincular' },
    { value: 'Pendiente+desvincular', label: 'Pendiente desvincular' },
    // { value: 'Vinculado', label: 'Vinculado' },
    { value: 'Dato+sensible', label: 'Dato sensible' },
    { value: 'Concurrencia', label: 'Concurrencia' },
    { value: 'Desvinculado', label: 'Desvinculado' }
  ];
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
  rutaHijaActiva = false;
  // Variables de uso
  usuario: Usuario;
  udsAsignadas: Uds[] = [];
  udsSeleccionada: string;
  estadoSeleccionado: string;
  query: string;
  udsAsignadasQuery: string[] = [];

  // Observables
  SubtituloPaginaNuevo: Subscription;

  @ViewChild('selectUds') selectUds: ElementRef;
  @ViewChild('selectEstado') selectEstado: ElementRef;

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService,
    private router: Router
  ) {
    this.usuario = this.usuario$.usuario;
    this.obtenerInfoRuta().subscribe((params: any) => {
      this.validarCriterioBusqueda(params);
    });
  }

  ngOnInit() {
    this.obtenerUdsAsignadas();
    this.subsSubtituloPag();
  }

  ngOnDestroy() {
    this.desuscribir();
  }

  verBeneficiario(id: string) {
    this.router.navigate(['beneficiarios/ver', id]);
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params)
    );
  }

  obtenerUdsAsignadas() {
    switch (this.usuario.rol) {
      case 'ADMIN':
        this.query = `admin=${this.usuario._id}`;
        break;
      case 'GESTOR':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'COORDINADOR':
        this.query = `coordinador=${this.usuario._id}`;
        break;
      default:
        this.query = `docente=${this.usuario._id}`;
        break;
    }
    // Si ya ha consultado una vez sólo toma los datos del LS
    const udsEnLocal = localStorage.getItem('udsAsignadas');
    if (udsEnLocal !== null) {
      this.udsAsignadas = JSON.parse(udsEnLocal);
      // obtengo Ids para query (estado)
      this.udsAsignadas.forEach((unidad: Uds) => {
        this.udsAsignadasQuery.push(unidad._id);
      });
    } else {
      this.uds$.obtenerUds_codigos(this.query).subscribe((resp: any) => {
        if (resp.ok) {
          this.udsAsignadas = resp.uds;
          // obtengo Ids para query (estado)
          this.udsAsignadas.forEach((unidad: Uds) => {
            this.udsAsignadasQuery.push(unidad._id);
          });

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
  }

  obtenerBeneficiarios_porEstado(estado: string) {
    this.router.navigate(['beneficiarios/estado', estado]);
  }

  validarCriterioBusqueda(params: any) {
    if (params.hasOwnProperty('estado')) {
      // console.log('envió estado: ' + params.estado);
      this.estadoSeleccionado = params.estado;
      this.udsSeleccionada = null;
      return;
    } else if (params.hasOwnProperty('udsId')) {
      // console.log('envió uds: ' + params.udsId);
      this.udsSeleccionada = params.udsId;
      this.estadoSeleccionado = null;
      return;
    } else {
      this.udsSeleccionada = null;
      this.estadoSeleccionado = null;
      return;
    }
  }

  subsSubtituloPag() {
    this.SubtituloPaginaNuevo = this.beneficiarios$.subtituloPag$.subscribe(
      (sub: string) => {
        this.subtituloPagina = sub;
      }
    );
  }

  desuscribir() {
    this.SubtituloPaginaNuevo.unsubscribe();
  }
}
