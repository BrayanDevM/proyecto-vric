import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
// Importo municipios y ciudades de Colombia
import listaDatosColombia from 'src/app/config/colombia.json';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { alertSuccess } from 'src/app/helpers/swal2.config';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormIngresoComponent } from '../dialogs/dialog-form-ingreso/dialog-form-ingreso.component';
import { Config } from 'src/app/config/config';
declare var moment: any;

@Component({
  selector: 'app-form-cambios',
  templateUrl: './form-cambios.component.html',
  styleUrls: ['./form-cambios.component.css']
})
export class FormCambiosComponent implements OnInit {
  tiposDeDocumento: any[] = [
    {
      pais: 'Colombianas/os',
      documentos: [{ value: 'RC', label: 'Registro civil', icon: 'fa-id-card' }]
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
  tiposDeDocumentoAdulto: any[] = [
    {
      pais: 'Colombianas/os',
      documentos: [
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

  sexos: any[] = Config.SELECTS.sexos;
  paises: any[] = Config.SELECTS.paises;
  reconocimientos: any[] = Config.SELECTS.autorreconocimientos;
  discapacidades: any[] = Config.SELECTS.discapacidades;
  criterios: any[] = Config.SELECTS.criteriosDeAtencion;
  tipoResponsables: any[] = Config.SELECTS.tiposDeAcudientes;
  // -----------------------------
  usuario: any;
  formCambio: FormGroup;
  docReadOnly = false;
  @Input() udsAsignadas: Uds[];
  beneficiarios: Beneficiario[] = [];
  cargandoBeneficiarios = false;
  madreSeleccionada: Beneficiario = null;

  listaDepartamentos: any = listaDatosColombia;
  listaMunicipios = ['Extranjero'];
  codigoUdsSeleccionada: any = 'Seleccionar UDS';

  tienePadre = true;

  semanaActual: any;
  proximoCambioGestantes: any;

  // Máximo fechas mat-DatePicker
  maxNacimiento: Date;
  minNacimiento: Date;
  maxIngreso: Date;
  minIngreso: Date;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService,
    private adaptadorFecha: DateAdapter<any>,
    private dialog: MatDialog
  ) {
    // para Material Datetime-Picker
    this.adaptadorFecha.setLocale('es');
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();

    this.minNacimiento = new Date(anioActual - 100, 0, 1); // 100 años atrás enero 1
    this.maxNacimiento = new Date(moment()); // Hoy

    this.minIngreso = new Date(anioActual, mesActual, 1); // mes vigente
    this.maxIngreso = new Date(moment()); // Hoy

    this.formCambio = this.fb.group({
      // Información de beneficiario
      selectUds: [null, Validators.required],
      beneficiarioId: [null, Validators.required],
      tipoDoc: [null, Validators.required],
      documento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      nombre1: ['', Validators.required],
      nombre2: [''],
      apellido1: ['', Validators.required],
      apellido2: [''],
      sexo: [null, Validators.required],
      nacimiento: [null, Validators.required],
      paisNacimiento: [null, Validators.required],
      dptoNacimiento: [null, Validators.required],
      municipioNacimiento: [null, Validators.required],
      autorreconocimiento: [null, Validators.required],
      discapacidad: [null, Validators.required],
      infoDiscapacidad: null,
      direccion: [null],
      telefono: [null],
      barrio: [null],
      criterio: [null],
      infoCriterio: [null],
      tipoResponsable: 'Madre',
      comentario: null,
      udsId: [null, Validators.required],
      ingreso: [null, Validators.required],
      // Información de responsable
      respTipoDoc: [null],
      respDocumento: [''],
      respNombre1: [''],
      respNombre2: [''],
      respApellido1: [''],
      respApellido2: [''],
      respSexo: [null],
      respNacimiento: [null],
      respPaisNacimiento: [null],
      respDptoNacimiento: [null],
      respMunicipioNacimiento: [null],
      // Información de madre
      madreTipoDoc: [null],
      madreDocumento: [''],
      madreNombre1: [null],
      madreNombre2: null,
      madreApellido1: [null],
      madreApellido2: null,
      madreSexo: [null],
      madreNacimiento: [null],
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
      padreNombre1: ['', Validators.required],
      padreNombre2: [''],
      padreApellido1: ['', Validators.required],
      padreApellido2: [''],
      padreSexo: [null, Validators.required],
      padreNacimiento: [null, Validators.required],
      // otro
      fecha: null
    });
  }

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.semanaActual = this.weekOfMonth(moment());
  }

  weekOfMonth(m: any) {
    return (
      m.week() -
      moment(m)
        .startOf('month')
        .week() +
      1
    );
  }

  get f() {
    return this.formCambio;
  }
  get fc() {
    return this.formCambio.controls;
  }
  get fv() {
    return this.formCambio.value;
  }

  filtroFinDeSemana = (d: Date | null): boolean => {
    const dia = (d || new Date()).getDay();
    // Previene la selección de sábado y domingo.
    return dia !== 0 && dia !== 6;
  };

  cambiarCodigoUds($event: any) {
    if ($event === undefined) {
      return;
    }
    const index = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === $event.value
    );
    this.codigoUdsSeleccionada = this.udsAsignadas[index].codigo;
  }

  traerMadres($event: any) {
    this.cargandoBeneficiarios = true;
    this.beneficiarios = [];
    let contador = 0;
    this.uds$
      .obtenerUnidad_beneficiarios($event.value)
      .subscribe((resp: any) => {
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
      (mg: Beneficiario) => mg._id === $event.value
    );
    this.madreSeleccionada = this.beneficiarios[index];
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
      this.f.get('padreTipoDoc').patchValue(null);
      this.f.get('padreDocumento').patchValue(null);
      this.f.get('padreNombre1').patchValue(null);
      this.f.get('padreNombre2').patchValue('');
      this.f.get('padreApellido1').patchValue(null);
      this.f.get('padreApellido2').patchValue('');
      this.f.get('padreNacimiento').patchValue(null);
      this.f.get('padreSexo').patchValue(null);
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
  comprobarSD($event: any, campo: string) {
    if ($event.value === 'SD') {
      const documentoAleatorio = this.generarDocumento(13);
      this.f.get(campo).patchValue(documentoAleatorio);
    } else {
      this.f.get(campo).patchValue('');
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
          (data: any) => data.departamento === departamento.value
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

  reemplazarInfoForm(madre: Beneficiario) {
    this.formCambio.patchValue({
      // Info ubicación
      direccion: madre.direccion,
      barrio: madre.barrio,
      telefono: madre.telefono,
      criterio: 'Otro',
      infoCriterio: 'Cambio de mujer gestante',
      // Info responsable
      respNombre1: madre.nombre1,
      respNombre2: madre.nombre2,
      respApellido1: madre.apellido1,
      respApellido2: madre.apellido2,
      respTipoDoc: madre.tipoDoc,
      respDocumento: madre.documento.split('.').join(''),
      respNacimiento: madre.nacimiento,
      respSexo: madre.sexo,
      respPaisNacimiento: madre.paisNacimiento,
      respDptoNacimiento: madre.dptoNacimiento,
      respMunicipioNacimiento: madre.municipioNacimiento,
      // Info madre
      madreNombre1: madre.nombre1,
      madreNombre2: madre.nombre2,
      madreApellido1: madre.apellido1,
      madreApellido2: madre.apellido2,
      madreTipoDoc: madre.tipoDoc,
      madreDocumento: madre.documento.split('.').join(''),
      madreNacimiento: madre.nacimiento,
      madreSexo: madre.sexo
    });
  }

  /**
   * Formateamos las fechas a formato DD/MM/YYYY para almacenar en
   * la base de datos
   */
  procesarFormulario() {
    this.formCambio.patchValue({
      documento: this.fv.documento.split('.').join(''),
      fecha: moment().format('DD/MM/YYYY'),
      ingreso: moment(this.fv.ingreso).format('DD/MM/YYYY'),
      nacimiento: moment(this.fv.nacimiento).format('DD/MM/YYYY')
    });
    if (this.tienePadre) {
      this.formCambio.patchValue({
        padreDocumento: this.fv.padreDocumento.split('.').join(''),
        padreNacimiento: moment(this.fv.padreNacimiento).format('DD/MM/YYYY')
      });
    }
  }

  dialogConfirmar(form: FormGroup): void {
    const confirmar = this.dialog.open(DialogFormIngresoComponent, {
      width: '516px',
      data: form
    });
    confirmar.afterClosed().subscribe(confirmacion => {
      this.reportarCambio(confirmacion);
    });
  }

  async confirmarIngreso() {
    // if (this.formCambio.invalid) {
    //   this.formCambio.markAllAsTouched();
    //   return;
    // }
    this.reemplazarInfoForm(this.madreSeleccionada);
    this.dialogConfirmar(this.formCambio);
  }

  reportarCambio(confirmaIngreso: boolean) {
    if (confirmaIngreso) {
      this.procesarFormulario();
      console.log(this.formCambio.value);

      return;
      this.beneficiarios$.crearBeneficiario(this.formCambio.value).subscribe(
        (resp: any) => {
          if (resp.ok) {
            this.tienePadre = true;
            this.formCambio.enable();
            this.formGroupDirective.resetForm();
            alertSuccess.fire('Beneficiario reportado');
          }
        },
        error => console.log(error)
      );
    }
  }
}
