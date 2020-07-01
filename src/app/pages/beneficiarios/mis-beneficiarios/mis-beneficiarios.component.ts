import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { Uds } from 'src/app/models/uds.model';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
declare var jQuery: any;

@Component({
  selector: 'app-mis-beneficiarios',
  templateUrl: './mis-beneficiarios.component.html',
  styleUrls: ['./mis-beneficiarios.component.css']
})
export class MisBeneficiariosComponent implements OnInit {
  usuario: Usuario;
  udsAsignadas: Uds[] = [];
  unidadSeleccionada: string;
  beneficiariosPendientes: Beneficiario[] = [];
  beneficiariosDS: Beneficiario[] = [];
  beneficiariosVinculados: Beneficiario[] = [];
  beneficiariosDesvinculados: Beneficiario[] = [];
  beneficiariosPorEstado: Beneficiario[] = [];
  verBeneficiario: Beneficiario = null;

  mostrarPorUds = false;
  mostrarPorEstado = false;
  estadoSeleccionado: string;

  @ViewChild('selectUds', { static: true }) selectUds: ElementRef;
  @ViewChild('selectEstado', { static: true }) selectEstado: ElementRef;

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService
  ) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.obtenerUds();
  }

  obtenerUds() {
    const arregloUds: Uds[] = [];
    let contador = 0;
    this.usuario.uds.forEach(unidad => {
      this.uds$.obtenerUnidad(unidad).subscribe((resp: any) => {
        arregloUds.push(resp.unidad);
      });
      contador += 1;
      if (contador === this.usuario.uds.length) {
        this.udsAsignadas = arregloUds;
        this.refrescarSelect(550);
      }
    });
  }

  traerBeneficiariosUds(udsId: string) {
    // Vaciamos los arreglos con beneficiarios
    this.beneficiariosPendientes = [];
    this.beneficiariosDS = [];
    this.beneficiariosVinculados = [];
    this.beneficiariosDesvinculados = [];
    this.beneficiariosPorEstado = [];
    this.selectEstado.nativeElement.value = null;
    // Traemos y guaramos en arreglos
    this.uds$.obtenerUnidad(udsId).subscribe((resp: any) => {
      resp.unidad.beneficiarios.forEach((beneficiario: Beneficiario) => {
        switch (beneficiario.estado) {
          case 'Pendiente vincular':
            this.beneficiariosPendientes.push(beneficiario);
            break;
          case 'Pendiente desvincular':
            this.beneficiariosPendientes.push(beneficiario);
            break;
          case 'Dato Sensible':
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
      });
      this.mostrarPorEstado = false;
      this.mostrarPorUds = true;
    });
    // console.log('Pendientes', this.beneficiariosPendientes);
    // console.log('DS', this.beneficiariosDS);
    // console.log('Vinculados', this.beneficiariosVinculados);
    // console.log('Desvinculados', this.beneficiariosDesvinculados);
  }

  traerBeneficiariosPorEstado(estado: string) {
    // Vaciamos los arreglos con beneficiarios
    this.estadoSeleccionado = estado;
    this.beneficiariosPendientes = [];
    this.beneficiariosDS = [];
    this.beneficiariosVinculados = [];
    this.beneficiariosDesvinculados = [];
    this.beneficiariosPorEstado = [];
    this.selectUds.nativeElement.value = null;
    this.uds$.obtenerUds().subscribe((resp: any) => {
      resp.uds.forEach((unidad: Uds) => {
        unidad.beneficiarios.forEach((beneficiario: Beneficiario) => {
          if (beneficiario.estado === estado) {
            this.beneficiariosPorEstado.push(beneficiario);
          }
        });
      });
      this.mostrarPorEstado = true;
      this.mostrarPorUds = false;
      this.refrescarSelect(500);
    });
  }

  actualizarListado(realizaCambio?: boolean) {
    if (realizaCambio) {
      if (this.mostrarPorEstado) {
        this.traerBeneficiariosPorEstado(this.estadoSeleccionado);
      } else {
        this.traerBeneficiariosUds(this.unidadSeleccionada);
      }
    }
  }

  verInfoBeneficiario(beneficiario: Beneficiario) {
    this.verBeneficiario = beneficiario;
    jQuery('#infoBeneficiario').modal({
      show: true
    });
  }

  refrescarSelect(ms: number) {
    setTimeout(() => jQuery('.selectpicker').selectpicker('refresh'), ms);
  }
}
