import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// Importo municipios y ciudades de Colombia
import listaDatosColombia from 'src/app/config/colombia.json';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { NgOption } from '@ng-select/ng-select';
import { alertSuccess, alertConfirm } from 'src/app/helpers/swal2.config';
declare var moment: any;

@Component({
  selector: 'app-form-cambios',
  templateUrl: './form-cambios.component.html',
  styleUrls: ['./form-cambios.component.css']
})
export class FormCambiosComponent implements OnInit {
  // ng-select -------------------
  tiposDeDocumento: NgOption = [
    {
      value: 'RC',
      label: 'Registro Civil',
      group: 'Colombianas/os',
      icon: 'fad fa-id-card'
    },
    // {
    //   value: 'TI',
    //   label: 'Tarjeta de Identidad',
    //   group: 'Colombianas/os',
    //   icon: 'fad fa-id-card'
    // },
    // {
    //   value: 'CC',
    //   label: 'Cédula de Ciudadanía',
    //   group: 'Colombianas/os',
    //   icon: 'fad fa-id-card'
    // },
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
  usuario: any;
  formCambio: FormGroup;
  docReadOnly = false;
  creando = false;
  @Input() udsAsignadas: Uds[];
  beneficiarios: Beneficiario[];
  cargandoBeneficiarios = false;
  madreSeleccionada: Beneficiario = null;

  listaDepartamentos: any = listaDatosColombia;
  listaMunicipios = ['Extranjero'];
  codigoUdsSeleccionada: any;

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService
  ) {
    this.formCambio = this.fb.group({
      // Información de beneficiario
      selectUds: null,
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

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
  }

  cambiarCodigoUds($event: any) {
    const i = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === $event._id
    );
    this.formCambio.get('codigo').patchValue(this.udsAsignadas[i].codigo);
  }

  traerMadres($event: any) {
    this.cargandoBeneficiarios = true;
    this.beneficiarios = [];
    let contador = 0;
    this.uds$.obtenerUnidad_beneficiarios($event._id).subscribe((resp: any) => {
      if (resp.ok) {
        const mujeresGestantesVinculadas = [];
        this.beneficiarios = resp.unidad.beneficiarios;
        this.beneficiarios.forEach((beneficiario: Beneficiario) => {
          if (beneficiario.estado === 'Vinculado') {
            if (
              beneficiario.tipoDoc === 'CC' ||
              beneficiario.tipoDoc === 'TI'
            ) {
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
          contador++;
          if (contador === this.beneficiarios.length) {
            this.beneficiarios = mujeresGestantesVinculadas;
            this.cargandoBeneficiarios = false;
          }
        });
      } else {
        this.cargandoBeneficiarios = false;
      }
    });
  }

  mostrarInfoMadre($event: any) {
    const index = this.beneficiarios.findIndex(
      (mg: Beneficiario) => mg._id === $event._id
    );
    this.madreSeleccionada = this.beneficiarios[index];
  }

  reemplazarInfoForm(madre: Beneficiario) {
    // Info ubicación
    this.formCambio.value.direccion = madre.direccion;
    this.formCambio.value.barrio = madre.barrio;
    this.formCambio.value.telefono = madre.telefono;
    this.formCambio.value.criterio = 'Otro';
    this.formCambio.value.infoCriterio = 'Cambio de Mujer Gestante';
    // Info responsable
    this.formCambio.value.respNombre1 = madre.nombre1;
    this.formCambio.value.respNombre2 = madre.nombre2;
    this.formCambio.value.respApellido1 = madre.apellido1;
    this.formCambio.value.respApellido2 = madre.apellido2;
    this.formCambio.value.respTipoDoc = madre.tipoDoc;
    this.formCambio.value.respDocumento = madre.documento;
    this.formCambio.value.respNacimiento = madre.nacimiento;
    this.formCambio.value.respSexo = madre.sexo;
    this.formCambio.value.respPaisNacimiento = madre.paisNacimiento;
    this.formCambio.value.respDptoNacimiento = madre.dptoNacimiento;
    this.formCambio.value.respMunicipioNacimiento = madre.municipioNacimiento;
    this.formCambio.value.tipoResponsable = 'Madre';
    this.formCambio.value.fecha = moment().format('DD/MM/YYYY');
  }

  /**
   *
   * @param $event
   * No puedo usar ViewChild para asignar el valor del SD, puesto que este intenta
   * tomar el elemento cuando aún no se ha creado porque el usuario primero debe
   * seleccionar una MG, sin embargo, pude proceder a asignar el valor con el método
   * patchValue del formulario reactivo, pero!, cuando relleno otro campo este se vuelve
   * undefined, por qué?
   * Pendiente solucionar para usar patchvalue en formulario de ingresos
   */
  comprobarSD($event: any) {
    if ($event.value === 'SD') {
      this.formCambio.get('documento').patchValue(this.generarDocumento(15));
      this.docReadOnly = true;
    } else {
      this.formCambio.get('documento').setValue('');
      this.docReadOnly = false;
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
        this.formCambio.get('autorreconocimiento').patchValue('Ninguno');
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

  formatearFechas() {
    this.formCambio.value.ingreso = moment(
      this.formCambio.value.ingreso,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
    this.formCambio.value.nacimiento = moment(
      this.formCambio.value.nacimiento,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
  }

  reportarCambio() {
    this.reemplazarInfoForm(this.madreSeleccionada);
    this.formatearFechas();
    alertConfirm
      .fire({
        title: 'Novedades',
        html: `<span>Deseas reportar al beneficiario:</span>
        <ul class="mt-2">
          <li>
            ${this.formCambio.value.nombre1}
            ${this.formCambio.value.nombre2}
            ${this.formCambio.value.apellido1}
            ${this.formCambio.value.apellido2}
          </li>
          <li>${this.formCambio.value.tipoDoc}: ${this.formCambio.value.documento}</li>
          <li>Nacimiento: ${this.formCambio.value.nacimiento}</li>
        </ul>
      `,
        confirmButtonText: 'Sí, reportar cambio'
      })
      .then((result: any) => {
        if (result.value) {
          this.creando = true;
          this.beneficiarios$
            .crearBeneficiario(this.formCambio.value)
            .subscribe(
              (resp: any) => {
                if (resp.ok) {
                  this.creando = false;
                  this.formCambio.reset();
                  alertSuccess.fire({
                    title: 'Beneficiario reportado',
                    text: 'Recuerda reportar el egreso de la Mujer Gestante',
                    timer: 4000
                  });
                } else {
                  this.creando = false;
                }
              },
              error => (this.creando = false)
            );
        }
      });
  }
}
