import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
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
  selector: 'app-form-cambios',
  templateUrl: './form-cambios.component.html',
  styleUrls: ['./form-cambios.component.css']
})
export class FormCambiosComponent implements OnInit {
  usuario: any;
  formCambio: FormGroup;
  @Input() udsAsignadas: Uds[];
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

    this.formCambio = this.fb.group({
      // Información de beneficiario
      beneficiarioId: null,
      tipoDoc: [null, Validators.required],
      documento: [null, Validators.required],
      nombre1: [null, Validators.required],
      nombre2: null,
      apellido1: [null, Validators.required],
      apellido2: null,
      sexo: [null, Validators.required],
      discapacidad: [false, Validators.required],
      infoDiscapacidad: null,
      nacimiento: [null, Validators.required],
      paisNacimiento: [null, Validators.required],
      dptoNacimiento: [null, Validators.required],
      municipioNacimiento: [null, Validators.required],
      direccion: [null, Validators.required],
      telefono: [null, Validators.required],
      barrio: [null, Validators.required],
      autorreconocimiento: [null, Validators.required],
      criterio: [null, Validators.required],
      infoCriterio: [null, Validators.required],
      tipoResponsable: [null, Validators.required],
      comentario: null,
      udsId: null,
      codigo: 'Seleccionar UDS',
      ingreso: null,
      // Información de responsable
      respTipoDoc: [null, Validators.required],
      respDocumento: [null, Validators.required],
      respNombre1: [null, Validators.required],
      respNombre2: null,
      respApellido1: [null, Validators.required],
      respApellido2: null,
      respSexo: [null, Validators.required],
      respNacimiento: [null, Validators.required],
      respPaisNacimiento: [null, Validators.required],
      respDptoNacimiento: [null, Validators.required],
      respMunicipioNacimiento: [null, Validators.required],
      fecha: null
    });
  }

  cambiarCodigoUds(udsId: any) {
    this.formCambio.value.codigo = udsId;
    const index = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === udsId
    );
    this.codigoUdsSeleccionada = this.udsAsignadas[index].codigo;
  }

  traerMadres(udsId: string) {
    this.beneficiarios = [];
    this.uds$.obtenerUnidad(udsId).subscribe((resp: any) => {
      const mujeresGestantesVinculadas = [];
      this.beneficiarios = resp.unidad.beneficiarios;
      this.beneficiarios.forEach((beneficiario: Beneficiario) => {
        if (beneficiario.estado === 'Vinculado') {
          if (beneficiario.tipoDoc === 'CC' || beneficiario.tipoDoc === 'TI') {
            mujeresGestantesVinculadas.push(beneficiario);
          }
          const hoy = moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY');
          const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
          const edadAnios = hoy.diff(nacimiento, 'years');
          // Si es extranjero y mayor de 10 años
          if (beneficiario.tipoDoc === 'SD' && edadAnios > 10) {
            mujeresGestantesVinculadas.push(beneficiario);
          }
        }
      });
      this.beneficiarios = mujeresGestantesVinculadas;
    });
    this.refrescarSelect();
  }

  mostrarInfoMadre(id: string) {
    const index = this.beneficiarios.findIndex(
      (mg: Beneficiario) => mg._id === id
    );
    this.madreSeleccionada = this.beneficiarios[index];
    this.refrescarSelect();
  }

  reemplazarInfoForm(madre: Beneficiario) {
    // Info ubicación
    this.formCambio.value.direccion = madre.direccion;
    this.formCambio.value.barrio = madre.barrio;
    this.formCambio.value.telefono = madre.telefono;
    this.formCambio.value.criterio = madre.criterio;
    this.formCambio.value.infoCriterio = madre.infoCriterio;
    // Info responsable
    this.formCambio.value.respNombre1 = madre.nombre1;
    this.formCambio.value.respNombre2 = madre.nombre2;
    this.formCambio.value.respApellido1 = madre.apellido1;
    this.formCambio.value.respApellido2 = madre.apellido2;
    this.formCambio.value.respTipoDoc = madre.tipoDoc;
    this.formCambio.value.respDocumento = madre.documento;
    this.formCambio.value.respNacimiento = moment(
      madre.nacimiento,
      'YYYY-MM-DD'
    );
    this.formCambio.value.respSexo = madre.sexo;
    this.formCambio.value.respPaisNacimiento = madre.paisNacimiento;
    this.formCambio.value.respDptoNacimiento = madre.dptoNacimiento;
    this.formCambio.value.respMunicipioNacimiento = madre.municipioNacimiento;
    this.formCambio.value.tipoResponsable = 'Madre';
    this.formCambio.value.fecha = moment().format('DD/MM/YYYY');
  }

  reportarCambio() {
    this.reemplazarInfoForm(this.madreSeleccionada);
    this.formCambio.value.ingreso = moment(
      this.formCambio.value.ingreso,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
    Swal.fire({
      title: 'Reportar nacimiento',
      html: `¿Los datos son del beneficiario <b>
        ${this.formCambio.value.nombre1}
        ${this.formCambio.value.nombre2}
        ${this.formCambio.value.apellido1}
        ${this.formCambio.value.apellido2}
        </b>identificado con <b>${this.formCambio.value.tipoDoc}:
        ${this.formCambio.value.documento}</b> son correctos?`,
      icon: 'warning',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reportar cambio'
    }).then((result: any) => {
      if (result.value) {
        this.beneficiarios$
          .crearBeneficiario(this.formCambio.value)
          .subscribe((resp: any) => console.log(resp));
      }
    });
  }

  comprobarSD(tipoDoc: string) {
    if (tipoDoc === 'SD') {
      const documentoAleatorio = this.generarDocumento(15);
      this.inputDocumento.nativeElement.value = documentoAleatorio;
      this.formCambio.value.documento = documentoAleatorio;
      this.inputDocumento.nativeElement.disabled = true;
    } else {
      this.inputDocumento.nativeElement.value = null;
      this.inputDocumento.nativeElement.disabled = false;
    }
  }

  generarDocumento(longitud: number) {
    let resultado = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const caracteresLength = caracteres.length;
    for (let i = 0; i < longitud; i++) {
      resultado += caracteres.charAt(
        Math.floor(Math.random() * caracteresLength)
      );
    }
    return resultado;
  }

  cambiarDepartamentos(pais: string) {
    /**
     * Si selecciona un país diferente a colombia, por defecto deja
     * los departamentos y municipios como están: 'Extranjero'
     * Si no, agrega la lista de datos del json directamente y el
     * select realiza un *ngFor de la lista.departamentos
     */
    if (pais !== 'Colombia') {
      this.listaDepartamentos = [{ departamento: 'Extranjero' }];
    } else {
      this.listaDepartamentos = this.datosColombia;
    }
    // console.log(this.listaDepartamentos);
    this.refrescarSelect();
  }

  cambiarCiudades(departamento: string) {
    /**
     * Si el departamento está por defecto 'extranjero' lo dejamos
     * igual, si es diferente (Dpto de colombia), este toma el valor
     * (nombre), busca y toma el id dentro de la lista completa y
     * asigna las ciudades del municipio
     */
    if (departamento === 'Extranjero') {
      this.listaMunicipios = ['Extranjero'];
    } else {
      const index = this.datosColombia.findIndex(
        (municipio: any) => municipio.departamento === departamento
      );
      this.listaMunicipios = this.datosColombia[index].ciudades;
    }
    this.refrescarSelect();
  }

  refrescarSelect() {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, 300);
  }
}
