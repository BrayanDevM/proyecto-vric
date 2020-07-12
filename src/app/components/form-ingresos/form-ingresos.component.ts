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
import { NgOption } from '@ng-select/ng-select';
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
      } else {
        this.listaDepartamentos = listaDatosColombia;
      }
    } else {
      // Sino, lo recibí de un select
      if (pais !== 'Colombia') {
        this.listaDepartamentos = [{ departamento: 'Extranjero' }];
      } else {
        this.listaDepartamentos = listaDatosColombia;
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
        }
      });
  }

  ingresarBeneficiario() {
    Swal.fire({
      title: 'Reportar ingreso',
      html: `¿Los datos del beneficiario <b>
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
}
