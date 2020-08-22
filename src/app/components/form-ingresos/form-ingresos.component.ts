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
import { DateAdapter } from '@angular/material/core';
declare var moment: any;

@Component({
  selector: 'app-form-ingresos',
  templateUrl: './form-ingresos.component.html',
  styleUrls: ['./form-ingresos.component.css']
})
export class FormIngresosComponent implements OnInit {
  // variables de configuración
  tiposDeDocumento: any[] = [
    {
      pais: 'Colombianas/os',
      documentos: [
        { value: 'RC', label: 'Registro civil', icon: 'fa-id-card' },
        { value: 'TI', label: 'Tarjeta de Identidad', icon: 'fa-id-card' },
        { value: 'CC', label: 'Cédula de Ciudadanía', icon: 'fa-id-card' }
      ]
    },
    {
      pais: 'Extranjeras/os',
      documentos: [
        {
          value: 'PEP',
          label: 'Permiso Especial de Permanencia',
          icon: 'fa-user-clock'
        },
        { value: 'SD', label: 'Sin Documento', icon: 'fa-question-square' }
      ]
    }
  ];
  sexos: any[] = [
    {
      value: 'Mujer',
      label: 'Mujer',
      icon: 'fa-venus'
    },
    {
      value: 'Hombre',
      label: 'Hombre',
      icon: 'fa-mars'
    },
    {
      value: 'Otro',
      label: 'Otro',
      icon: 'fa-venus-mars'
    }
  ];
  paises: any[] = [
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'México', label: 'México' },
    { value: 'Panamá', label: 'Panamá' },
    { value: 'Perú', label: 'Chile' },
    { value: 'Venezuela', label: 'Venezuela' }
  ];
  reconocimientos: any[] = [
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
  discapacidades: any[] = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' }
  ];
  criterios: any[] = [
    { value: 'Sisbén', label: 'Puntaje de sisbén' },
    { value: 'Carta de vulnerabilidad', label: 'Carta de vulnerabilidad' },
    { value: 'Otro', label: 'Otro' }
  ];
  tipoResponsables: any[] = [
    { value: 'Madre', label: 'Madre' },
    { value: 'Padre', label: 'Padre' },
    { value: 'Tia/o', label: 'Tia/o' },
    { value: 'Abuelo/a', label: 'Abuelo/a' },
    { value: 'Conyugue', label: 'Conyugue' },
    { value: 'Si misma', label: 'Si misma' },
    { value: 'Otro', label: 'Otro' }
  ];
  // Variables de uso
  usuario: Usuario;
  formIngreso: FormGroup;
  @Input() udsAsignadas: Uds[];
  codigoUdsSeleccionada: any = 'Seleccionar UDS';
  listaDepartamentos: any = listaDatosColombia;
  listaMunicipios: any = [{ ciudades: 'Extranjero' }];
  respExiste = false;
  ultResponsableBuscado = '';

  tieneMadre = true;
  madreEsMismoAcudiente = false;
  tienePadre = true;
  padreEsMismoAcudiente = false;

  // Configuración dinámica para criterio carta/puntaje
  tipoInputInfoCriterio = 'text';
  labelInputInfoCriterio = 'Detalle criterio';

  // Para responsable (acudiente)
  listaDepartamentosResp: any = [{ departamento: 'Extranjero' }];
  listaMunicipiosResp = ['Extranjero'];

  // Máximo fechas mat-DatePicker
  maxNacimiento: Date;
  minNacimiento: Date;
  maxIngreso: Date;
  minIngreso: Date;

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private respBen$: RespBeneficiariosService,
    private adaptadorFecha: DateAdapter<any>
  ) {
    // para Material
    this.adaptadorFecha.setLocale('es');
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();

    this.minNacimiento = new Date(anioActual - 100, 0, 1); // 100 años atrás enero 1
    this.maxNacimiento = new Date(moment()); // Hoy

    this.minIngreso = new Date(anioActual, mesActual, 1); // mes vigente
    this.maxIngreso = new Date(moment()); // Hoy

    // anterior
    this.usuario = this.usuario$.usuario;
    this.formIngreso = this.fb.group({
      // Información de beneficiario
      tipoDoc: [null, Validators.required],
      documento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      nombre1: [null, Validators.required],
      nombre2: '',
      apellido1: [null, Validators.required],
      apellido2: '',
      sexo: [null, Validators.required],
      nacimiento: [null, Validators.required],
      paisNacimiento: [null, Validators.required],
      dptoNacimiento: [null, Validators.required],
      municipioNacimiento: [null, Validators.required],
      autorreconocimiento: [null, Validators.required],
      discapacidad: [null, Validators.required],
      infoDiscapacidad: null,
      direccion: [null, Validators.required],
      barrio: [null, Validators.required],
      telefono: [
        null,
        [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
      ],
      criterio: [null, Validators.required],
      infoCriterio: [null, Validators.required],
      tipoResponsable: [null, Validators.required],
      udsId: [null, Validators.required],
      // codigo: 'Seleccionar UDS',
      ingreso: [null, Validators.required],
      comentario: null,
      // Información de responsable
      respTipoDoc: [null, Validators.required],
      respDocumento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      respNombre1: [null, Validators.required],
      respNombre2: null,
      respApellido1: [null, Validators.required],
      respApellido2: null,
      respSexo: [null, Validators.required],
      respNacimiento: [null, Validators.required],
      respPaisNacimiento: [null, Validators.required],
      respDptoNacimiento: [null, Validators.required],
      respMunicipioNacimiento: [null, Validators.required],
      // Información de madre
      madreTipoDoc: [null, Validators.required],
      madreDocumento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      madreNombre1: [null, Validators.required],
      madreNombre2: null,
      madreApellido1: [null, Validators.required],
      madreApellido2: null,
      madreSexo: [null, Validators.required],
      madreNacimiento: [null, Validators.required],
      // Información de padre
      padreTipoDoc: [null, Validators.required],
      padreDocumento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      padreNombre1: [null, Validators.required],
      padreNombre2: null,
      padreApellido1: [null, Validators.required],
      padreApellido2: null,
      padreSexo: [null, Validators.required],
      padreNacimiento: [null, Validators.required],
      fecha: null,
      estado: 'Pendiente vincular'
    });
  }

  ngOnInit() {}

  get f() {
    return this.formIngreso;
  }

  get fc() {
    return this.formIngreso.controls;
  }

  get fv() {
    return this.formIngreso.value;
  }

  filtroFinDeSemana = (d: Date | null): boolean => {
    const dia = (d || new Date()).getDay();
    // Previene la selección de sábado y domingo.
    return dia !== 0 && dia !== 6;
  };

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
    console.log(departamento, 'dep');

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
      if (departamento.value === 'Extranjero') {
        this.listaMunicipios = ['Extranjero'];
      } else {
        const i = this.listaDepartamentos.findIndex(
          (data: any) => data.departamento === departamento.value
        );
        this.listaMunicipios = this.listaDepartamentos[i].ciudades;
        console.log(this.listaMunicipios, 'lista mun');
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
        console.log(this.listaMunicipios, 'lista mun');
      }
    }
  }

  comprobarSD($event: any, campo: string) {
    if ($event.value === 'SD') {
      const documentoAleatorio = this.generarDocumento(13);
      this.f.get(campo).patchValue(documentoAleatorio);
    } else {
      this.f.get(campo).patchValue(null);
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
      if (departamento.value === 'Extranjero') {
        this.listaMunicipiosResp = ['Extranjero'];
      } else {
        const i = this.listaDepartamentosResp.findIndex(
          (data: any) => data.departamento === departamento.value
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
      this.tipoInputInfoCriterio = 'numeric';
      this.labelInputInfoCriterio = 'Escriba el puntaje';
    } else if ($event.value === 'Carta de vulnerabilidad') {
      this.tipoInputInfoCriterio = 'date';
      this.labelInputInfoCriterio = 'Fecha de visita';
    } else {
      this.tipoInputInfoCriterio = 'text';
      this.labelInputInfoCriterio = 'Detalle otro';
    }
  }

  validarMadre() {
    if (this.tieneMadre) {
      this.f.get('madreTipoDoc').enable();
      this.f.get('madreDocumento').enable();
      this.f.get('madreNombre1').enable();
      this.f.get('madreNombre2').enable();
      this.f.get('madreApellido1').enable();
      this.f.get('madreApellido2').enable();
      this.f.get('madreNacimiento').enable();
      this.f.get('madreSexo').enable();
    } else {
      this.f.get('madreTipoDoc').disable();
      this.f.get('madreDocumento').disable();
      this.f.get('madreNombre1').disable();
      this.f.get('madreNombre2').disable();
      this.f.get('madreApellido1').disable();
      this.f.get('madreApellido2').disable();
      this.f.get('madreNacimiento').disable();
      this.f.get('madreSexo').disable();
    }
  }

  madreEsAcudiente() {
    this.padreEsMismoAcudiente = false;
    if (this.madreEsMismoAcudiente) {
      this.f.get('madreTipoDoc').patchValue(this.fv.respTipoDoc);
      this.f.get('madreDocumento').patchValue(this.fv.respDocumento);
      this.f.get('madreNombre1').patchValue(this.fv.respNombre1);
      this.f.get('madreNombre2').patchValue(this.fv.respNombre2);
      this.f.get('madreApellido1').patchValue(this.fv.respApellido1);
      this.f.get('madreApellido2').patchValue(this.fv.respApellido2);
      this.f.get('madreNacimiento').patchValue(this.fv.respNacimiento);
      this.f.get('madreSexo').patchValue(this.fv.respSexo);
    } else {
      this.f.get('madreTipoDoc').patchValue(null);
      this.f.get('madreDocumento').patchValue(null);
      this.f.get('madreNombre1').patchValue('');
      this.f.get('madreNombre2').patchValue('');
      this.f.get('madreApellido1').patchValue('');
      this.f.get('madreApellido2').patchValue('');
      this.f.get('madreNacimiento').patchValue(null);
      this.f.get('madreSexo').patchValue(null);
    }
  }

  validarPadre() {
    if (this.tienePadre) {
      this.f.get('padreTipoDoc').enable();
      this.f.get('padreDocumento').enable();
      this.f.get('padreNombre1').enable();
      this.f.get('padreNombre2').enable();
      this.f.get('padreApellido1').enable();
      this.f.get('padreApellido2').enable();
      this.f.get('padreNacimiento').enable();
      this.f.get('padreSexo').enable();
    } else {
      this.f.get('padreTipoDoc').disable();
      this.f.get('padreDocumento').disable();
      this.f.get('padreNombre1').disable();
      this.f.get('padreNombre2').disable();
      this.f.get('padreApellido1').disable();
      this.f.get('padreApellido2').disable();
      this.f.get('padreNacimiento').disable();
      this.f.get('padreSexo').disable();
    }
  }

  padreEsAcudiente() {
    this.madreEsMismoAcudiente = false;
    if (this.padreEsMismoAcudiente) {
      this.f.get('padreTipoDoc').patchValue(this.fv.respTipoDoc);
      this.f.get('padreDocumento').patchValue(this.fv.respDocumento);
      this.f.get('padreNombre1').patchValue(this.fv.respNombre1);
      this.f.get('padreNombre2').patchValue(this.fv.respNombre2);
      this.f.get('padreApellido1').patchValue(this.fv.respApellido1);
      this.f.get('padreApellido2').patchValue(this.fv.respApellido2);
      this.f.get('padreNacimiento').patchValue(this.fv.respNacimiento);
      this.f.get('padreSexo').patchValue(this.fv.respSexo);
    } else {
      this.f.get('padreTipoDoc').patchValue(null);
      this.f.get('padreDocumento').patchValue(null);
      this.f.get('padreNombre1').patchValue('');
      this.f.get('padreNombre2').patchValue('');
      this.f.get('padreApellido1').patchValue('');
      this.f.get('padreApellido2').patchValue('');
      this.f.get('padreNacimiento').patchValue(null);
      this.f.get('padreSexo').patchValue(null);
    }
  }

  cambiarCodigoUds($event: any) {
    if ($event === undefined) {
      return;
    }
    this.formIngreso.value.codigo = $event.value;
    const index = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === $event.value
    );
    this.codigoUdsSeleccionada = this.udsAsignadas[index].codigo;
  }

  buscarRespBeneficiario(documento: string) {
    if (documento === '') {
      this.despejarCamposResponsable();
      this.respExiste = false;
      return;
    }
    this.ultResponsableBuscado = documento;
    this.respBen$
      .obtenerResponsables(`documento=${documento}`)
      .subscribe((resp: any) => {
        if (resp.ok) {
          // console.log(resp);
          if (resp.respBeneficiarios.length > 0) {
            const responsable: RespBeneficiario = resp.respBeneficiarios[0];
            this.respExiste = true;

            this.f.get('respTipoDoc').patchValue(responsable.tipoDoc);
            this.f.get('respTipoDoc').disable();

            this.f.get('respNombre1').patchValue(responsable.nombre1);
            this.f.get('respNombre1').disable();

            this.f.get('respNombre2').patchValue(responsable.nombre2);
            this.f.get('respNombre2').disable();

            this.f.get('respApellido1').patchValue(responsable.apellido1);
            this.f.get('respApellido1').disable();

            this.f.get('respApellido2').patchValue(responsable.apellido2);
            this.f.get('respApellido2').disable();

            this.f
              .get('respNacimiento')
              .patchValue(
                new Date(moment(responsable.nacimiento, 'DD/MM/YYYY'))
              );

            this.f.get('respNacimiento').disable();

            this.f.get('respSexo').patchValue(responsable.sexo);
            this.f.get('respSexo').disable();

            this.f
              .get('respPaisNacimiento')
              .patchValue(responsable.paisNacimiento);
            this.f.get('respPaisNacimiento').disable();
            this.cambiarDepartamentosResp(responsable.paisNacimiento);

            this.f
              .get('respDptoNacimiento')
              .patchValue(responsable.dptoNacimiento);
            this.f.get('respDptoNacimiento').disable();
            this.cambiarCiudadesResp(responsable.dptoNacimiento);

            this.f
              .get('respMunicipioNacimiento')
              .patchValue(responsable.municipioNacimiento);
            this.f.get('respMunicipioNacimiento').disable();
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
    this.f.get('respNombre1').patchValue(null);
    this.f.get('respNombre1').enable();

    this.f.get('respNombre2').patchValue(null);
    this.f.get('respNombre2').enable();

    this.f.get('respApellido1').patchValue(null);
    this.f.get('respApellido1').enable();

    this.f.get('respApellido2').patchValue(null);
    this.f.get('respApellido2').enable();

    this.f.get('respNacimiento').patchValue(null);
    this.f.get('respNacimiento').enable();

    this.f.get('respTipoDoc').patchValue(null);
    this.f.get('respTipoDoc').enable();

    this.f.get('respSexo').patchValue(null);
    this.f.get('respSexo').enable();

    this.f.get('respPaisNacimiento').patchValue([]);
    this.f.get('respPaisNacimiento').enable();
    this.cambiarDepartamentosResp([]);

    this.f.get('respDptoNacimiento').patchValue([]);
    this.f.get('respDptoNacimiento').enable();
    this.cambiarCiudadesResp('Extranjero');

    this.f.get('respMunicipioNacimiento').patchValue([]);
    this.f.get('respMunicipioNacimiento').enable();
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

  limpiarFormulario() {
    this.formIngreso.reset();
  }

  ingresarBeneficiario() {
    if (this.formIngreso.invalid) {
      this.formIngreso.markAllAsTouched();
      return;
    }
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
          // this.creando = true;
          this.beneficiarios$
            .crearBeneficiario(this.formIngreso.value)
            .subscribe((resp: any) => {
              if (resp.ok) {
                // this.creando = false;
                this.formIngreso.reset();
                alertSuccess.fire({
                  title: 'Beneficiario reportado'
                });
              } else {
                // this.creando = false;
              }
            });
        }
      });
  }
}
