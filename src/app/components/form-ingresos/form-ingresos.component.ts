import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Importo municipios y ciudades de Colombia
import listaDatosColombia from 'src/app/config/colombia.json';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Uds } from 'src/app/models/uds.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Usuario } from 'src/app/models/usuario.model';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { RespBeneficiariosService } from 'src/app/services/resp-beneficiarios.service';
import {
  alertDanger,
  alertSuccess,
  alertConfirm
} from 'src/app/helpers/swal2.config';
declare var moment: any;

@Component({
  selector: 'app-form-ingresos',
  templateUrl: './form-ingresos.component.html',
  styleUrls: ['./form-ingresos.component.css']
})
export class FormIngresosComponent implements OnInit {
  // ng-select -------------------
  tiposDeDocumento: NgOption = [
    {
      value: 'RC',
      label: 'Registro Civil',
      group: 'Colombianas/os',
      icon: 'fad fa-id-card'
    },
    {
      value: 'TI',
      label: 'Tarjeta de Identidad',
      group: 'Colombianas/os',
      icon: 'fad fa-id-card'
    },
    {
      value: 'CC',
      label: 'Cédula de Ciudadanía',
      group: 'Colombianas/os',
      icon: 'fad fa-id-card'
    },
    {
      value: 'PEP',
      label: 'Permiso Especial de Permanencia',
      group: 'Extranjeras/os',
      icon: 'fas fa-user-clock'
    },
    {
      value: 'SD',
      label: 'Sin Documento',
      group: 'Extranjeras/os',
      icon: 'fas fa-question-square'
    }
  ];
  sexos: NgOption = [
    {
      value: 'Mujer',
      label: 'Mujer',
      icon: 'fad fa-venus'
    },
    {
      value: 'Hombre',
      label: 'Hombre',
      icon: 'fad fa-mars'
    },
    {
      value: 'Otro',
      label: 'Otro',
      icon: 'fad fa-venus-mars'
    }
  ];
  paises: NgOption = [
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'México', label: 'México' },
    { value: 'Panamá', label: 'Panamá' },
    { value: 'Perú', label: 'Chile' },
    { value: 'Venezuela', label: 'Venezuela' }
  ];
  reconocimientos: NgOption = [
    { value: 'Afrocolombiano', label: 'Afrocolombiano' },
    { value: 'Comunidad negra', label: 'Comunidad negra' },
    { value: 'Indigena', label: 'Indigena' },
    { value: 'Palenquero', label: 'Palenquero' },
    { value: 'RROM/Gitano', label: 'RROM/Gitano' },
    {
      value: 'Raizal archipielago San Andrés',
      label: 'Raizal archipielago San Andrés'
    },
    { value: 'Ninguno', label: 'Ninguno' }
  ];
  discapacidades: NgOption = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' }
  ];
  criterios: NgOption = [
    { value: 'Sisbén', label: 'Puntaje de sisbén' },
    { value: 'Carta de vulnerabilidad', label: 'Carta de vulnerabilidad' },
    { value: 'Otro', label: 'Otro' }
  ];
  tipoResponsables: NgOption = [
    { value: 'Madre', label: 'Madre' },
    { value: 'Padre', label: 'Padre' },
    { value: 'Tio/a', label: 'Madre' },
    { value: 'Abuelo/a', label: 'Abuelo/a' },
    { value: 'Conyugue', label: 'Conyugue' },
    { value: 'Si misma', label: 'Si misma' },
    { value: 'Otro', label: 'Otro' }
  ];
  // -----------------------------
  // Variables de uso
  listaDepartamentos: any = listaDatosColombia;
  listaMunicipios: any = [{ ciudades: 'Extranjero' }];

  // Variables de formulario
  formIngreso: FormGroup;
  creando = false;
  // Referencias a elementos de formulario beneficiario
  @ViewChild('documento') iDocumento: ElementRef;
  @ViewChild('nombre1') iNombre1: ElementRef;
  @ViewChild('nombre2') iNombre2: ElementRef;
  @ViewChild('apellido1') iApellido1: ElementRef;
  @ViewChild('apellido2') iApellido2: ElementRef;
  @ViewChild('sexo') iSexo: ElementRef;
  @ViewChild('nacimiento') iNacimiento: ElementRef;
  @ViewChild('paisNacimiento') iPaisNacimiento: ElementRef;
  @ViewChild('dptoNacimiento') iDptoNacimiento: ElementRef;
  @ViewChild('municipioNacimiento') iMunicipioNacimiento: ElementRef;
  @ViewChild('autorreconocimiento') iAutorreconocimiento: ElementRef;
  @ViewChild('discapacidad') iDiscapacidad: ElementRef;
  @ViewChild('direccion') iDireccion: ElementRef;
  @ViewChild('barrio') iBarrio: ElementRef;
  @ViewChild('telefono') iTelefono: ElementRef;
  @ViewChild('criterio') iCriterio: ElementRef;
  @ViewChild('infoCriterio') iInfoCriterio: ElementRef;
  // Referencias a elementos de formulario responsable
  @ViewChild('respTipoDoc') irespTipoDoc: NgSelectComponent;
  @ViewChild('respDocumento') iRespDocumento: ElementRef;
  @ViewChild('respNombre1') iRespNombre1: ElementRef;
  @ViewChild('respNombre2') iRespNombre2: ElementRef;
  @ViewChild('respApellido1') iRespApellido1: ElementRef;
  @ViewChild('respApellido2') iRespApellido2: ElementRef;
  @ViewChild('respSexo') iRespSexo: NgSelectComponent;
  @ViewChild('respNacimiento') iRespNacimiento: ElementRef;
  @ViewChild('respPaisNac') iRespPaisNac: NgSelectComponent;
  @ViewChild('respDptoNac') iRespDptoNac: NgSelectComponent;
  @ViewChild('respMunicipioNac') iRespMunicipioNac: NgSelectComponent;
  @ViewChild('respTipoResp') iRespTipoResp: NgSelectComponent;

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
    private respBen$: RespBeneficiariosService
  ) {
    this.usuario = this.usuario$.usuario;
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

  ngOnInit() {}

  cambiarDepartamentos(pais: any) {
    if (pais === undefined) {
      return;
    }
    /**
     * Si selecciona un país diferente a colombia, por defecto deja
     * los departamentos y municipios como están: 'Extranjero'
     * Si no, agrega la lista de datos del json directamente y el
     * select realiza un *ngFor de la lista.departamentos
     */
    // Si recibo un string (directo desde la BD)
    if (typeof pais !== 'string') {
      if (pais.value !== 'Colombia') {
        this.listaDepartamentos = [{ departamento: 'Extranjero' }];
        this.formIngreso.get('autorreconocimiento').patchValue('Ninguno');
      } else {
        this.listaDepartamentos = listaDatosColombia;
        this.formIngreso.get('autorreconocimiento').patchValue([]);
      }
    } else {
      // Sino, lo recibí de un select
      if (pais !== 'Colombia') {
        this.listaDepartamentos = [{ departamento: 'Extranjero' }];
        this.formIngreso.get('autorreconocimiento').patchValue('Ninguno');
      } else {
        this.listaDepartamentos = listaDatosColombia;
        this.formIngreso.get('autorreconocimiento').patchValue([]);
      }
    }
    // console.log(this.listaDepartamentos);
  }

  cambiarCiudades(departamento: any) {
    if (departamento === undefined) {
      return;
    }
    /**
     * Si el departamento está por defecto 'extranjero' lo dejamos
     * igual, si es diferente (Dpto de colombia), este toma el valor
     * (nombre), busca y toma el id dentro de la lista completa y
     * asigna las ciudades del municipio
     */
    if (typeof departamento !== 'string') {
      if (departamento.departamento === 'Extranjero') {
        this.listaMunicipios = ['Extranjero'];
      } else {
        const i = this.listaDepartamentos.findIndex(
          (data: any) => data.departamento === departamento.departamento
        );
        this.listaMunicipios = this.listaDepartamentos[i].ciudades;
      }
    } else {
      if (departamento === 'Extranjero') {
        this.listaMunicipios = ['Extranjero'];
      } else {
        // trim() elimina espacion en blando en los extremos de un string
        const i = this.listaDepartamentos.findIndex(
          (data: any) => data.departamento === departamento.trim()
        );
        this.listaMunicipios = this.listaDepartamentos[i].ciudades;
      }
    }
  }

  comprobarSD($event: any) {
    if ($event.value === 'SD') {
      const documentoAleatorio = this.generarDocumento(15);
      this.iDocumento.nativeElement.value = documentoAleatorio;
      this.formIngreso.value.documento = documentoAleatorio;
      this.iDocumento.nativeElement.disabled = true;
    } else {
      this.iDocumento.nativeElement.value = null;
      this.iDocumento.nativeElement.disabled = false;
    }
  }

  cambiarDepartamentosResp(pais: any) {
    if (pais === undefined) {
      return;
    }
    if (typeof pais !== 'string') {
      if (pais.value !== 'Colombia') {
        this.listaDepartamentosResp = [{ departamento: 'Extranjero' }];
      } else {
        this.listaDepartamentosResp = listaDatosColombia;
      }
    } else {
      // Sino, lo recibí de un select
      if (pais !== 'Colombia') {
        this.listaDepartamentosResp = [{ departamento: 'Extranjero' }];
      } else {
        this.listaDepartamentosResp = listaDatosColombia;
      }
    }
  }

  cambiarCiudadesResp(departamento: any) {
    console.log(departamento);
    if (departamento === undefined) {
      return;
    }
    if (typeof departamento !== 'string') {
      if (departamento.departamento === 'Extranjero') {
        this.listaMunicipiosResp = ['Extranjero'];
      } else {
        const i = this.listaDepartamentosResp.findIndex(
          (data: any) => data.departamento === departamento.departamento
        );
        this.listaMunicipiosResp = this.listaDepartamentosResp[i].ciudades;
      }
    } else {
      if (departamento === 'Extranjero') {
        this.listaMunicipiosResp = ['Extranjero'];
      } else {
        // trim() elimina espacion en blando en los extremos de un string
        const i = this.listaDepartamentosResp.findIndex(
          (data: any) => data.departamento === departamento.trim()
        );
        this.listaMunicipiosResp = this.listaDepartamentosResp[i].ciudades;
      }
    }
  }

  comprobarRespSD($event: any) {
    if ($event.value === 'SD') {
      const documentoAleatorio = this.generarDocumento(15);
      this.iRespDocumento.nativeElement.value = documentoAleatorio;
      this.formIngreso.value.respDocumento = documentoAleatorio;
      this.iRespDocumento.nativeElement.disabled = true;
    } else {
      this.iRespDocumento.nativeElement.value = null;
      this.iRespDocumento.nativeElement.disabled = false;
    }
  }

  validarCriterio($event: any) {
    if ($event.value === 'Sisbén') {
      this.tipoInputInfoCriterio = 'number';
      this.labelInputInfoCriterio = 'Escriba el puntaje';
      this.iInfoCriterio.nativeElement.step = '00.01';
    } else if ($event.value === 'Carta de vulnerabilidad') {
      this.tipoInputInfoCriterio = 'date';
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

  cambiarCodigoUds($event: any) {
    if ($event === undefined) {
      return;
    }
    this.formIngreso.value.codigo = $event._id;
    const index = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === $event._id
    );
    this.codigoUdsSeleccionada = this.udsAsignadas[index].codigo;
  }

  buscarRespBeneficiario(documento: string) {
    if (documento === '') {
      this.despejarCamposResponsable();
      this.respExiste = false;
      return;
    }
    let responsable: RespBeneficiario;
    this.respBen$.buscarRespBeneficiario(documento).subscribe((resp: any) => {
      if (resp.ok) {
        console.log(resp);
        if (resp.responsable.length > 0) {
          responsable = resp.responsable[0];
          this.respExiste = true;

          this.formIngreso.get('respTipoDoc').patchValue(responsable.tipoDoc);
          this.irespTipoDoc.setDisabledState(true);

          this.iRespNombre1.nativeElement.value = responsable.nombre1;
          this.iRespNombre1.nativeElement.disabled = true;

          this.iRespNombre2.nativeElement.value = responsable.nombre2;
          this.iRespNombre2.nativeElement.disabled = true;

          this.iRespApellido1.nativeElement.value = responsable.apellido1;
          this.iRespApellido1.nativeElement.disabled = true;

          this.iRespApellido2.nativeElement.value = responsable.apellido2;
          this.iRespApellido2.nativeElement.disabled = true;

          this.iRespNacimiento.nativeElement.value = moment(
            responsable.nacimiento,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD');
          this.iRespNacimiento.nativeElement.disabled = true;

          this.formIngreso.get('respSexo').patchValue(responsable.sexo);
          this.iRespSexo.setDisabledState(true);

          this.iRespNacimiento.nativeElement.disabled = true;

          this.formIngreso
            .get('respPaisNacimiento')
            .patchValue(responsable.paisNacimiento);
          this.iRespPaisNac.setDisabledState(true);
          this.cambiarDepartamentosResp(responsable.paisNacimiento);

          this.formIngreso
            .get('respDptoNacimiento')
            .patchValue(responsable.dptoNacimiento);
          this.iRespDptoNac.setDisabledState(true);
          this.cambiarCiudadesResp(responsable.dptoNacimiento);

          this.formIngreso
            .get('respMunicipioNacimiento')
            .patchValue(responsable.municipioNacimiento);
          this.iRespMunicipioNac.setDisabledState(true);

          this.iRespTipoResp.focus();
          this.iRespTipoResp.open();
        } else {
          this.respExiste = false;
          // this.despejarCamposResponsable();
        }
      } else {
        this.respExiste = false;
        // this.despejarCamposResponsable();
      }
    });
  }

  despejarCamposResponsable() {
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

    this.formIngreso.get('respTipoDoc').patchValue([]);
    this.irespTipoDoc.setDisabledState(false);

    this.formIngreso.get('respSexo').patchValue([]);
    this.iRespSexo.setDisabledState(false);

    this.formIngreso.get('respPaisNacimiento').patchValue([]);
    this.iRespPaisNac.setDisabledState(false);
    this.cambiarDepartamentosResp([]);

    this.formIngreso.get('respDptoNacimiento').patchValue([]);
    this.iRespDptoNac.setDisabledState(false);
    this.cambiarCiudadesResp('Extranjero');

    this.formIngreso.get('respMunicipioNacimiento').patchValue([]);
    this.iRespMunicipioNac.setDisabledState(false);
  }

  formatearFechas() {
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
  }

  ingresarBeneficiario() {
    this.formatearFechas();
    alertConfirm
      .fire({
        title: 'Novedades',
        html: `<span>Deseas reportar al beneficiario:</span>
        <ul class="mt-2">
          <li>
            ${this.formIngreso.value.nombre1}
            ${this.formIngreso.value.nombre2}
            ${this.formIngreso.value.apellido1}
            ${this.formIngreso.value.apellido2}
          </li>
          <li>${this.formIngreso.value.tipoDoc}: ${this.formIngreso.value.documento}</li>
          <li>Nacimiento: ${this.formIngreso.value.nacimiento}</li>
        </ul>
      `,
        confirmButtonText: 'Sí, reportar ingreso'
      })
      .then((result: any) => {
        if (result.value) {
          this.creando = true;
          this.beneficiarios$
            .crearBeneficiario(this.formIngreso.value)
            .subscribe((resp: any) => {
              if (resp.ok) {
                this.creando = false;
                this.formIngreso.reset();
                alertSuccess.fire({
                  title: 'Beneficiario reportado'
                });
              } else {
                this.creando = false;
              }
            });
        }
      });
  }
}
