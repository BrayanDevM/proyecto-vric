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
  alertConfirm,
  alertError
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
    { value: 'Tia/o', label: 'Tia/o' },
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
  madreExiste = false;
  padreExiste = false;

  tienePadre = true;
  tieneMadre = true;

  madreIgualAResp = false;
  padreIgualAResp = false;
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
      documento: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(13)]
      ],
      nombre1: ['', Validators.required],
      nombre2: '',
      apellido1: ['', Validators.required],
      apellido2: '',
      sexo: [null, Validators.required],
      discapacidad: [null, Validators.required],
      infoDiscapacidad: null,
      nacimiento: [null, Validators.required],
      paisNacimiento: [null, Validators.required],
      dptoNacimiento: [null, Validators.required],
      municipioNacimiento: [null, Validators.required],
      direccion: [null, Validators.required],
      telefono: [
        null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
      ],
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
      respDocumento: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(13)]
      ],
      respNombre1: ['', Validators.required],
      respNombre2: '',
      respApellido1: ['', Validators.required],
      respApellido2: '',
      respSexo: [null, Validators.required],
      respNacimiento: [null, Validators.required],
      respPaisNacimiento: [null, Validators.required],
      respDptoNacimiento: [null, Validators.required],
      respMunicipioNacimiento: [null, Validators.required],
      fecha: null,
      estado: 'Pendiente vincular',
      // Información Padre
      madreTipoDoc: [null, Validators.required],
      madreDocumento: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(13)]
      ],
      madreNombre1: ['', Validators.required],
      madreNombre2: '',
      madreApellido1: ['', Validators.required],
      madreApellido2: '',
      madreSexo: [null, Validators.required],
      madreNacimiento: [null, Validators.required],
      // Información Madre
      padreTipoDoc: [null, Validators.required],
      padreDocumento: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(13)]
      ],
      padreNombre1: ['', Validators.required],
      padreNombre2: '',
      padreApellido1: ['', Validators.required],
      padreApellido2: '',
      padreSexo: [null, Validators.required],
      padreNacimiento: [null, Validators.required]
    });
  }

  ngOnInit() {}

  get f(): FormGroup {
    return this.formIngreso;
  }
  get fv(): any {
    return this.formIngreso.value;
  }
  get fc() {
    return this.formIngreso.controls;
  }
  get frv(): any {
    return this.formIngreso.getRawValue();
  }

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

  comprobarSD($event: any, campo: string) {
    if ($event.value === 'SD') {
      const documentoAleatorio = this.generarDocumento(13);
      this.f.get(campo).patchValue(documentoAleatorio);
    } else {
      this.f.get(campo).patchValue('');
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
    this.fv.codigo = $event._id;
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
    this.respBen$
      .obtenerResponsables(`documento=${documento}`)
      .subscribe((resp: any) => {
        if (resp.ok) {
          // console.log(resp);
          if (resp.respBeneficiarios.length > 0) {
            const responsable: RespBeneficiario = resp.respBeneficiarios[0];
            this.respExiste = true;

            this.formIngreso.patchValue({
              respTipoDoc: responsable.tipoDoc,
              respNombre1: responsable.nombre1,
              respNombre2: responsable.nombre2,
              respApellido1: responsable.apellido2,
              respApellido2: responsable.apellido2,
              respNacimiento: moment(
                responsable.nacimiento,
                'DD/MM/YYYY'
              ).format('YYYY-MM-DD'),
              respSexo: responsable.sexo,
              respPaisNacimiento: responsable.paisNacimiento
            });
            this.cambiarDepartamentosResp(responsable.paisNacimiento);
            this.formIngreso.patchValue({
              respDptoNacimiento: responsable.dptoNacimiento
            });
            this.cambiarCiudadesResp(responsable.dptoNacimiento);
            this.formIngreso.patchValue({
              respMunicipioNacimiento: responsable.municipioNacimiento
            });

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
    this.formIngreso.patchValue({
      respTipoDoc: null,
      respNombre1: '',
      respNombre2: '',
      respApellido1: '',
      respApellido2: '',
      respNacimiento: null,
      respSexo: null,
      respPaisNacimiento: null,
      respDptoNacimiento: null,
      respMunicipioNacimiento: null
    });
    this.respExiste = false;
  }

  desactivarCamposPadre() {
    if (!this.tienePadre) {
      this.f.get('padreTipoDoc').disable();
      this.f.get('padreDocumento').disable();
      this.f.get('padreNombre1').disable();
      this.f.get('padreNombre2').disable();
      this.f.get('padreApellido1').disable();
      this.f.get('padreApellido2').disable();
      this.f.get('padreSexo').disable();
      this.f.get('padreNacimiento').disable();
    } else {
      this.f.get('padreTipoDoc').enable();
      this.f.get('padreDocumento').enable();
      this.f.get('padreNombre1').enable();
      this.f.get('padreNombre2').enable();
      this.f.get('padreApellido1').enable();
      this.f.get('padreApellido2').enable();
      this.f.get('padreSexo').enable();
      this.f.get('padreNacimiento').enable();
    }
  }
  desactivarCamposMadre() {
    if (!this.tieneMadre) {
      this.f.get('madreTipoDoc').disable();
      this.f.get('madreDocumento').disable();
      this.f.get('madreNombre1').disable();
      this.f.get('madreNombre2').disable();
      this.f.get('madreApellido1').disable();
      this.f.get('madreApellido2').disable();
      this.f.get('madreSexo').disable();
      this.f.get('madreNacimiento').disable();
    } else {
      this.f.get('madreTipoDoc').enable();
      this.f.get('madreDocumento').enable();
      this.f.get('madreNombre1').enable();
      this.f.get('madreNombre2').enable();
      this.f.get('madreApellido1').enable();
      this.f.get('madreApellido2').enable();
      this.f.get('madreSexo').enable();
      this.f.get('madreNacimiento').enable();
    }
  }
  madreIgualResponsable() {
    if (this.madreIgualAResp) {
      this.padreIgualAResp = false;
      this.padreIgualResponsable();
      this.f.get('madreTipoDoc').patchValue(this.fv.respTipoDoc);
      this.f.get('madreDocumento').patchValue(this.fv.respDocumento);
      this.f.get('madreNombre1').patchValue(this.fv.respNombre1);
      this.f.get('madreNombre2').patchValue(this.fv.respNombre2);
      this.f.get('madreApellido1').patchValue(this.fv.respApellido1);
      this.f.get('madreApellido2').patchValue(this.fv.respApellido2);
      this.f.get('madreSexo').patchValue(this.fv.respSexo);
      this.f.get('madreNacimiento').patchValue(this.fv.respNacimiento);
    } else {
      this.f.get('madreTipoDoc').patchValue(null);
      this.f.get('madreDocumento').patchValue('');
      this.f.get('madreNombre1').patchValue('');
      this.f.get('madreNombre2').patchValue('');
      this.f.get('madreApellido1').patchValue('');
      this.f.get('madreApellido2').patchValue('');
      this.f.get('madreSexo').patchValue(null);
      this.f.get('madreNacimiento').patchValue(null);
    }
  }
  padreIgualResponsable() {
    if (this.padreIgualAResp) {
      this.madreIgualAResp = false;
      this.madreIgualResponsable();
      this.f.get('padreTipoDoc').patchValue(this.fv.respTipoDoc);
      this.f.get('padreDocumento').patchValue(this.fv.respDocumento);
      this.f.get('padreNombre1').patchValue(this.fv.respNombre1);
      this.f.get('padreNombre2').patchValue(this.fv.respNombre2);
      this.f.get('padreApellido1').patchValue(this.fv.respApellido1);
      this.f.get('padreApellido2').patchValue(this.fv.respApellido2);
      this.f.get('padreSexo').patchValue(this.fv.respSexo);
      this.f.get('padreNacimiento').patchValue(this.fv.respNacimiento);
    } else {
      this.f.get('padreTipoDoc').patchValue(null);
      this.f.get('padreDocumento').patchValue('');
      this.f.get('padreNombre1').patchValue('');
      this.f.get('padreNombre2').patchValue('');
      this.f.get('padreApellido1').patchValue('');
      this.f.get('padreApellido2').patchValue('');
      this.f.get('padreSexo').patchValue(null);
      this.f.get('padreNacimiento').patchValue(null);
    }
  }

  procesarFormulario() {
    this.formIngreso.patchValue({
      documento: this.fv.documento.split('.').join(''),
      fecha: moment().format('DD/MM/YYYY'),
      nacimiento: moment(this.fv.nacimiento, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      respDocumento: this.fv.respDocumento.split('.').join(''),
      respNacimiento: moment(this.fv.respNacimiento, 'YYYY-MM-DD').format(
        'DD/MM/YYYY'
      ),
      ingreso: moment(this.fv.ingreso, 'YYYY-MM-DD').format('DD/MM/YYYY')
    });
    if (this.tieneMadre) {
      this.formIngreso.patchValue({
        madreDocumento: this.fv.madreDocumento.split('.').join(''),
        madreNacimiento: moment(this.fv.madreNacimiento, 'YYYY-MM-DD').format(
          'DD/MM/YYYY'
        )
      });
    }
    if (this.tienePadre) {
      this.formIngreso.patchValue({
        padreDocumento: this.fv.padreDocumento.split('.').join(''),
        padreNacimiento: moment(this.fv.padreNacimiento, 'YYYY-MM-DD').format(
          'DD/MM/YYYY'
        )
      });
    }
  }

  ingresarBeneficiario() {
    this.formIngreso.patchValue({
      respNombre1: this.f.getRawValue().respNombre1,
      respNombre2: this.f.getRawValue().respNombre2,
      respApellido1: this.f.getRawValue().respApellido1,
      respApellido2: this.f.getRawValue().respApellido2,
      respNacimiento: this.f.getRawValue().respNacimiento
    });
    if (this.formIngreso.invalid) {
      alert('El formulario es inválido');
      console.log(this.formIngreso, '<-- form');
      this.formIngreso.markAllAsTouched();
      return;
    }
    console.log(this.formIngreso, '<-- form');
    alertConfirm
      .fire({
        title: 'Novedades',
        html: `<span>Deseas reportar al beneficiario:</span>
        <ul class="mt-2">
        <li>
        ${this.fv.nombre1}
            ${this.fv.nombre2}
            ${this.fv.apellido1}
            ${this.fv.apellido2}
            </li>
            <li>${this.fv.tipoDoc}: ${this.fv.documento}</li>
            <li>Nacimiento: ${this.fv.nacimiento}</li>
            </ul>
            `,
        confirmButtonText: 'Sí, reportar ingreso'
      })
      .then((result: any) => {
        if (result.value) {
          this.creando = true;
          this.procesarFormulario();
          this.beneficiarios$.crearBeneficiario(this.fv).subscribe(
            (resp: any) => {
              if (resp.ok) {
                this.creando = false;
                this.formIngreso.reset();
                alertSuccess.fire({
                  title: 'Beneficiario reportado'
                });
              } else {
                this.creando = false;
              }
            },
            error => {
              this.creando = false;
              alertError.fire({
                title: 'Beneficiarios',
                html: `No fue posible establecer contacto con el servidor, por favor intentalo nuevamente. <br> Error: ${JSON.parse(
                  error
                )} `,
                confirmButtonText: 'Entendido'
              });
            }
          );
        }
      });
  }
}
