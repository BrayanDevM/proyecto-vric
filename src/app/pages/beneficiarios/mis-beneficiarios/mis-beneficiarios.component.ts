import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { Uds } from 'src/app/models/uds.model';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
declare var jQuery: any;

@Component({
  selector: 'app-mis-beneficiarios',
  templateUrl: './mis-beneficiarios.component.html',
  styleUrls: ['./mis-beneficiarios.component.css']
})
export class MisBeneficiariosComponent implements OnInit {
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
  beneficiariosPendientes: Beneficiario[] = [];
  beneficiariosDS: Beneficiario[] = [];
  beneficiariosVinculados: Beneficiario[] = [];
  beneficiariosDesvinculados: Beneficiario[] = [];
  beneficiariosPorEstado: Beneficiario[] = [];

  verBeneficiario: Beneficiario = null;
  cargandoListado = false;

  mostrarPorUds = false;
  mostrarPorEstado = false;
  estadoSeleccionado: string;

  @ViewChild('selectUds', { static: true }) selectUds: NgSelectComponent;
  @ViewChild('selectEstado', { static: true }) selectEstado: NgSelectComponent;

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService
  ) {
    this.usuario = this.usuario$.usuario;
    if (this.usuario.rol === 'DOCENTE') {
      this.disableRol = true;
    }
  }

  ngOnInit() {
    this.obtenerUds();
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

  obtenerUds_beneficiarios_responsables($event: any) {
    let id: string;
    if (typeof $event === 'string') {
      id = $event;
    } else {
      id = $event._id;
    }
    this.selectEstado.handleClearClick();
    this.selectUds.focus();
    if ($event === undefined) {
      return;
    }
    this.cargandoListado = true;
    this.unidadSeleccionada = id;
    this.mostrarPorEstado = false;
    this.mostrarPorUds = true;
    // Vaciamos los arreglos con beneficiarios
    this.beneficiariosPendientes = [];
    this.beneficiariosDS = [];
    this.beneficiariosVinculados = [];
    this.beneficiariosDesvinculados = [];
    // this.selectEstado.nativeElement.value = null;
    // Traemos y guaramos en arreglos
    this.uds$
      .obtenerUnidad_beneficiarios_responsables(id)
      .subscribe((resp: any) => {
        resp.unidad.beneficiarios.forEach((beneficiario: Beneficiario) => {
          switch (beneficiario.estado) {
            case 'Pendiente vincular':
              this.beneficiariosPendientes.push(beneficiario);
              break;
            case 'Pendiente desvincular':
              this.beneficiariosPendientes.push(beneficiario);
              break;
            case 'Dato sensible':
              this.beneficiariosDS.push(beneficiario);
              break;
            case 'Concurrencia':
              this.beneficiariosDS.push(beneficiario);
              break;
            case 'Vinculado':
              this.beneficiariosVinculados.push(beneficiario);
              break;
            default:
              this.beneficiariosDesvinculados.push(beneficiario);
              break;
          }
          this.cargandoListado = false;
        });
      });
    // console.log('Pendientes', this.beneficiariosPendientes);
    // console.log('DS', this.beneficiariosDS);
    // console.log('Vinculados', this.beneficiariosVinculados);
    // console.log('Desvinculados', this.beneficiariosDesvinculados);
  }

  obtenerBeneficiariosPorEstado($event: any) {
    let estado: string;
    if (typeof $event === 'string') {
      estado = $event;
    } else {
      estado = $event.value;
    }
    this.selectUds.handleClearClick();
    this.selectEstado.focus();
    if ($event === undefined) {
      this.beneficiariosPorEstado = [];
      return;
    }
    this.estadoSeleccionado = estado;
    this.cargandoListado = true;
    this.beneficiarios$
      .obtenerBeneficiarios_responsables(`estado=${estado}`)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.ok) {
          this.beneficiariosPorEstado = resp.beneficiarios;
          this.cargandoListado = false;
          this.mostrarPorEstado = true;
          this.mostrarPorUds = false;
        } else {
          this.cargandoListado = false;
          this.mostrarPorEstado = true;
          this.mostrarPorUds = false;
        }
      });
  }

  actualizarListado(realizaCambio?: boolean) {
    if (realizaCambio) {
      if (this.mostrarPorEstado) {
        // cambiar backend
        this.obtenerBeneficiariosPorEstado(this.estadoSeleccionado);
      } else {
        this.obtenerUds_beneficiarios_responsables(this.unidadSeleccionada);
      }
    }
  }

  verInfoBeneficiario(beneficiario: Beneficiario) {
    this.verBeneficiario = beneficiario;
    jQuery('#infoBeneficiario').modal({
      show: true
    });
  }
}
