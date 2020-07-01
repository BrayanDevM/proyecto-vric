import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Importo municipios y ciudades de Colombia
import listaDatosColombia from 'src/app/config/colombia.json';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Usuario } from 'src/app/models/usuario.model';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
import { Beneficiario } from 'src/app/models/beneficiario.model';
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {
  usuario: any;
  formCambio: FormGroup;
  udsAsignadas: Uds[];
  beneficiarios: Beneficiario[];
  madreSeleccionada: Beneficiario = null;
  datosColombia: any = listaDatosColombia;
  listaDepartamentos: any = [{ departamento: 'Extranjero' }];
  listaMunicipios = ['Extranjero'];
  codigoUdsSeleccionada: any;

  @ViewChild('documento', { static: true }) inputDocumento: ElementRef;
  @ViewChild('respDocumento', { static: true }) inputRespDocumento: ElementRef;
  @ViewChild('infoCriterio', { static: true }) inputInfoCriterio: ElementRef;
  // Input respbeneficiario por si existe

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService
  ) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.obtenerUds();
  }

  obtenerUds() {
    return new Promise((resolve, reject) => {
      const arreglo = [];
      this.usuario.uds.forEach(unidad => {
        this.uds$.obtenerUnidad(unidad).subscribe((resp: any) => {
          arreglo.push(resp.unidad);
        });
      });
      resolve(arreglo);
    }).then((uds: Uds[]) => {
      this.udsAsignadas = uds;
      this.refrescarSelect();
    });
  }

  refrescarSelect() {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, 300);
  }
}
