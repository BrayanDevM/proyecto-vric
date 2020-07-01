import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';
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
  selector: 'app-form-ingresos',
  templateUrl: './form-ingresos.component.html',
  styleUrls: ['./form-ingresos.component.css']
})
export class FormIngresosComponent implements OnInit {
  // Variables de uso
  datosColombia: any = listaDatosColombia;
  listaDepartamentos: any = [{ departamento: 'Extranjero' }];
  listaMunicipios = ['Extranjero'];

  // Variables de formulario
  formIngreso: FormGroup;
  // Referencias a elementos de formulario beneficiario
  @ViewChild('tipoDoc', { static: true }) iTipoDoc: ElementRef;
  @ViewChild('documento', { static: true }) iDocumento: ElementRef;
  @ViewChild('nombre1', { static: true }) iNombre1: ElementRef;
  @ViewChild('nombre2', { static: true }) iNombre2: ElementRef;
  @ViewChild('apellido1', { static: true }) iApellido1: ElementRef;
  @ViewChild('apellido2', { static: true }) iApellido2: ElementRef;
  @ViewChild('sexo', { static: true }) iSexo: ElementRef;
  @ViewChild('nacimiento', { static: true }) iNacimiento: ElementRef;
  @ViewChild('paisNacimiento', { static: true }) iPaisNacimiento: ElementRef;
  @ViewChild('dptoNacimiento', { static: true }) iDptoNacimiento: ElementRef;
  @ViewChild('municipioNacimiento', { static: true })
  iMunicipioNacimiento: ElementRef;
  @ViewChild('autorreconocimiento', { static: true })
  iAutorreconocimiento: ElementRef;
  @ViewChild('discapacidad', { static: true }) iDiscapacidad: ElementRef;
  @ViewChild('direccion', { static: true }) iDireccion: ElementRef;
  @ViewChild('barrio', { static: true }) iBarrio: ElementRef;
  @ViewChild('telefono', { static: true }) iTelefono: ElementRef;
  @ViewChild('criterio', { static: true }) iCriterio: ElementRef;
  @ViewChild('infoCriterio', { static: true }) iInfoCriterio: ElementRef;
  // Referencias a elementos de formulario responsable
  @ViewChild('respTipoDoc', { static: true }) iRespTipoDoc: ElementRef;
  @ViewChild('respDocumento', { static: true }) iRespDocumento: ElementRef;
  @ViewChild('respNombre1', { static: true }) iRespNombre1: ElementRef;
  @ViewChild('respNombre2', { static: true }) iRespNombre2: ElementRef;
  @ViewChild('respApellido1', { static: true }) iRespApellido1: ElementRef;
  @ViewChild('respApellido2', { static: true }) iRespApellido2: ElementRef;
  @ViewChild('respSexo', { static: true }) iRespSexo: ElementRef;
  @ViewChild('respNacimiento', { static: true }) iRespNacimiento: ElementRef;
  @ViewChild('respPaisNac', { static: true }) iRespPaisNac: ElementRef;
  @ViewChild('respDptoNac', { static: true }) iRespDptoNac: ElementRef;
  @ViewChild('respMunicipioNac')
  iRespMunicipioNac: ElementRef;
  @ViewChild('respTipoResp', { static: true }) iRespTipoResp: ElementRef;

  // Configuración dinámica para criterio carta/puntaje
  tipoInputInfoCriterio = 'text';
  labelInputInfoCriterio = 'Detalle criterio';

  // Para responsable (acudiente)
  listaDepartamentosResp: any = [{ departamento: 'Extranjero' }];
  listaMunicipiosResp = ['Extranjero'];
  respExiste = false;
  // Info de usuario
  usuario: Usuario;
  @Input() udsAsignadas: Uds[];
  codigoUdsSeleccionada: any = 'Seleccionar UDS';

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService,
    private renderer: Renderer2
  ) {
    this.usuario = this.usuario$.usuario;
  }

  ngOnInit() {
    jQuery('.datetimepicker').datetimepicker({
      format: 'DD/MM/YYYY',
      daysOfWeekDisabled: [0, 6],
      locale: 'es',
      icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
      }
    });

    this.formIngreso = this.fb.group({
      // Información de beneficiario
      tipoDoc: [null, Validators.required],
      documento: ['', Validators.required],
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
      ingreso: [null, Validators.required],
      // Información de responsable
      respTipoDoc: [null, Validators.required],
      respDocumento: ['', Validators.required],
      respNombre1: [null, Validators.required],
      respNombre2: null,
      respApellido1: [null, Validators.required],
      respApellido2: null,
      respSexo: [null, Validators.required],
      respNacimiento: [null, Validators.required],
      respPaisNacimiento: [null, Validators.required],
      respDptoNacimiento: [null, Validators.required],
      respMunicipioNacimiento: [null, Validators.required],
      fecha: null,
      estado: 'Pendiente vincular'
    });
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
    this.refrescarSelect(50);
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
    this.refrescarSelect(50);
  }

  comprobarSD(tipoDoc: string) {
    if (tipoDoc === 'SD') {
      const documentoAleatorio = this.generarDocumento(15);
      this.iDocumento.nativeElement.value = documentoAleatorio;
      this.formIngreso.value.documento = documentoAleatorio;
      this.iDocumento.nativeElement.disabled = true;
    } else {
      this.iDocumento.nativeElement.value = null;
      this.iDocumento.nativeElement.disabled = false;
    }
  }

  cambiarDepartamentosResp(pais: string) {
    if (pais !== 'Colombia') {
      this.listaDepartamentosResp = [{ departamento: 'Extranjero' }];
    } else {
      this.listaDepartamentosResp = this.datosColombia;
    }
    this.refrescarSelect(50);
  }

  cambiarCiudadesResp(departamento: string) {
    if (departamento === 'Extranjero') {
      this.listaMunicipiosResp = ['Extranjero'];
    } else {
      const index = this.datosColombia.findIndex(
        (municipio: any) => municipio.departamento === departamento
      );
      this.listaMunicipiosResp = this.datosColombia[index].ciudades;
    }
    this.refrescarSelect(50);
  }

  comprobarRespSD(tipoDoc: string) {
    if (tipoDoc === 'SD') {
      const documentoAleatorio = this.generarDocumento(15);
      this.iRespDocumento.nativeElement.value = documentoAleatorio;
      this.formIngreso.value.respDocumento = documentoAleatorio;
      this.iRespDocumento.nativeElement.disabled = true;
    } else {
      this.iRespDocumento.nativeElement.value = null;
      this.iRespDocumento.nativeElement.disabled = false;
    }
  }

  validarCriterio(tipoCriterio: string) {
    if (tipoCriterio === 'Sisbén') {
      this.tipoInputInfoCriterio = 'number';
      this.labelInputInfoCriterio = 'Escriba el puntaje';
      this.iInfoCriterio.nativeElement.step = '00.01';
    } else if (tipoCriterio === 'Carta') {
      this.tipoInputInfoCriterio = 'text';
      this.tipoInputInfoCriterio = 'text';
      this.labelInputInfoCriterio = 'Fecha de visita';
    } else {
      this.tipoInputInfoCriterio = 'text';
      this.labelInputInfoCriterio = 'Detalle otro';
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

  cambiarCodigoUds(udsId: any) {
    this.formIngreso.value.codigo = udsId;
    const index = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === udsId
    );
    this.codigoUdsSeleccionada = this.udsAsignadas[index].codigo;
  }

  buscarRespBeneficiario(documento: string) {
    let respExiste: RespBeneficiario;
    this.beneficiarios$
      .buscarRespBeneficiario(documento)
      .subscribe((resp: any) => {
        if (resp.responsable.length !== 0) {
          respExiste = resp.responsable[0];
          this.respExiste = true;

          this.iRespTipoDoc.nativeElement.value = respExiste.tipoDoc;
          this.iRespTipoDoc.nativeElement.disabled = true;

          this.iRespNombre1.nativeElement.value = respExiste.nombre1;
          this.iRespNombre1.nativeElement.disabled = true;

          this.iRespNombre2.nativeElement.value = respExiste.nombre2;
          this.iRespNombre2.nativeElement.disabled = true;

          this.iRespApellido1.nativeElement.value = respExiste.apellido1;
          this.iRespApellido1.nativeElement.disabled = true;

          this.iRespApellido2.nativeElement.value = respExiste.apellido2;
          this.iRespApellido2.nativeElement.disabled = true;

          this.iRespNacimiento.nativeElement.value = moment(
            respExiste.nacimiento,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD');
          this.iRespNacimiento.nativeElement.disabled = true;

          this.iRespSexo.nativeElement.value = respExiste.sexo;
          this.iRespSexo.nativeElement.disabled = true;

          this.iRespNacimiento.nativeElement.disabled = true;

          this.iRespPaisNac.nativeElement.value = respExiste.paisNacimiento;
          this.iRespPaisNac.nativeElement.disabled = true;
          this.cambiarDepartamentosResp(respExiste.paisNacimiento);

          setTimeout(() => {
            this.iRespDptoNac.nativeElement.value = respExiste.dptoNacimiento;
            this.iRespDptoNac.nativeElement.disabled = true;
            this.cambiarCiudadesResp(respExiste.dptoNacimiento);
          }, 50);

          setTimeout(() => {
            this.iRespMunicipioNac.nativeElement.value =
              respExiste.municipioNacimiento;
            this.iRespMunicipioNac.nativeElement.disabled = true;
          }, 100);

          this.iRespTipoResp.nativeElement.focus();

          this.refrescarSelect(150);
        } else {
          this.respExiste = false;
          this.iRespNombre1.nativeElement.value = null;
          this.iRespNombre1.nativeElement.disabled = false;

          this.iRespNombre2.nativeElement.value = null;
          this.iRespNombre2.nativeElement.disabled = false;

          this.iRespApellido1.nativeElement.value = null;
          this.iRespApellido1.nativeElement.disabled = false;

          this.iRespApellido2.nativeElement.value = null;
          this.iRespApellido2.nativeElement.disabled = false;

          this.iRespNacimiento.nativeElement.value = null;
          this.iRespNacimiento.nativeElement.disabled = false;

          this.iRespPaisNac.nativeElement.disabled = false;
          this.iRespDptoNac.nativeElement.disabled = false;
          this.iRespMunicipioNac.nativeElement.disabled = false;
          this.refrescarSelect(50);
        }
      });
  }

  ingresarBeneficiario() {
    Swal.fire({
      title: 'Reportar ingreso',
      html: `¿Los datos son del beneficiario <b>
        ${this.formIngreso.value.nombre1}
        ${this.formIngreso.value.nombre2}
        ${this.formIngreso.value.apellido1}
        ${this.formIngreso.value.apellido2}
        </b>identificado con <b>${this.formIngreso.value.tipoDoc}:
        ${this.formIngreso.value.documento}</b> son correctos?`,
      icon: 'warning',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reportar ingreso'
    }).then((result: any) => {
      if (result.value) {
        this.formIngreso.value.fecha = moment().format('DD/MM/YYYY');

        this.formIngreso.value.nacimiento = moment(
          this.formIngreso.value.nacimiento,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY');

        this.formIngreso.value.respNacimiento = moment(
          this.formIngreso.value.nacimiento,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY');

        this.formIngreso.value.ingreso = moment(
          this.formIngreso.value.ingreso,
          'YYYY-MM-DD'
        ).format('DD/MM/YYYY');

        // console.log(this.formIngreso.value);
        this.beneficiarios$
          .crearBeneficiario(this.formIngreso.value)
          .subscribe();
      }
    });
  }

  refrescarSelect(ms: number) {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, ms);
  }
}
