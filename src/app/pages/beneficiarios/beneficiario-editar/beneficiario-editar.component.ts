import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
import { Madre } from 'src/app/models/madre.model';
import { Padre } from 'src/app/models/padre.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { RespBeneficiariosService } from 'src/app/services/resp-beneficiarios.service';
import { MadresService } from 'src/app/services/madres.service';
import { PadresService } from 'src/app/services/padres.service';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// Validators
// import { documentoExtranjero } from '../../../helpers/Validators/documento-extranjero.validator';
// Importo municipios y ciudades de Colombia
import listaDatosColombia from 'src/app/config/colombia.json';
import { alertSuccess } from 'src/app/helpers/swal2.config';
import { DateAdapter } from '@angular/material/core';
declare const moment: any;

@Component({
  selector: 'app-beneficiario-editar',
  templateUrl: './beneficiario-editar.component.html',
  styleUrls: ['./beneficiario-editar.component.css']
})
export class BeneficiarioEditarComponent implements OnInit, OnDestroy {
  query: string;
  usuario: Usuario;
  udsAsignadas: Uds[];

  beneficiario: Beneficiario;
  responsable: RespBeneficiario;
  madre: Madre;
  padre: Padre;

  // -------------
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
  motivosDeEgreso: any[] = [
    {
      value: 'Retiro voluntario del programa',
      label: 'Retiro voluntario del programa'
    },
    { value: 'Tránsito a otro programa', label: 'Tránsito a otro programa' },
    { value: 'Traslado de municipio', label: 'Traslado de municipio' },
    { value: 'Cambio a bebé lactante', label: 'Cambio a bebé lactante' },
    {
      value: 'Distancia del centro de atención',
      label: 'Distancia del centro de atención'
    },
    { value: 'Edad cumplida', label: 'Edad cumplida' },
    { value: 'Enfermedad', label: 'Enfermedad' },
    { value: 'Fallecimiento', label: 'Fallecimiento' },
    { value: 'No le gusta la comida', label: 'No le gusta la comida' },
    {
      value: 'En casa hay quien lo cuide',
      label: 'En casa hay quien lo cuide'
    },
    {
      value: 'Alto costo para la familia (transporte)',
      label: 'Alto costo para la familia (transporte)'
    },
    { value: 'Cambio vigencia', label: 'Cambio vigencia' },
    { value: 'Conflicto armado', label: 'Conflicto armado' },
    { value: 'Desplazamiento forzado', label: 'Desplazamiento forzado' },
    { value: 'Pasó al SIMAT', label: 'Pasó al SIMAT' },
    { value: 'Otro', label: 'Otro' }
  ];
  // Variables de uso
  codigoUdsSeleccionada: any = 'Seleccionar UDS';
  listaDepartamentos: any = listaDatosColombia;
  listaMunicipios: any = ['Extranjero'];
  respExiste = false;
  ultResponsableBuscado = '';

  tieneMadre = true;
  madreEsMismoAcudiente = false;
  tienePadre = true;
  padreEsMismoAcudiente = false;

  haEgresado = false;

  // Configuración dinámica para criterio carta/puntaje
  tipoInputInfoCriterio = 'text';
  labelInputInfoCriterio = 'Detalle criterio';

  // Para responsable (acudiente)
  listaDepartamentosResp: any = ['Extranjero'];
  listaMunicipiosResp = ['Extranjero'];

  // Máximo fechas mat-DatePicker
  maxNacimiento: Date;
  minNacimiento: Date;
  maxIngreso: Date;
  minIngreso: Date;

  // forms
  formBeneficiario: FormGroup;
  formAcudiente: FormGroup;
  formMadre: FormGroup;
  formPadre: FormGroup;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private beneficiario$: BeneficiariosService,
    private responsable$: RespBeneficiariosService,
    private madre$: MadresService,
    private padre$: PadresService,
    private formBuilder: FormBuilder,
    private adaptadorFecha: DateAdapter<any>
  ) {
    this.usuario = this.usuario$.usuario;

    // para Material Datetime-Picker
    this.adaptadorFecha.setLocale('es');
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();

    this.minNacimiento = new Date(anioActual - 100, 0, 1); // 100 años atrás enero 1
    this.maxNacimiento = new Date(moment()); // Hoy

    this.minIngreso = new Date(anioActual, 0, 1); // mes vigente
    this.maxIngreso = new Date(moment()); // Hoy

    this.obtenerUds();

    this.obtenerInfoRuta().subscribe(paramId => {
      if (paramId !== undefined) {
        this.obtenerBeneficiario(paramId).then(beneficiario => {
          console.log(beneficiario);
          this.limpiarEspaciosObjeto(beneficiario);
          this.patchFormulario(beneficiario);
          this.beneficiario = beneficiario;
        });
      }
    });

    // formularios
    this.formBeneficiario = this.formBuilder.group({
      _id: '',
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
      nombre2: '',
      apellido1: ['', Validators.required],
      apellido2: '',
      sexo: [null, Validators.required],
      nacimiento: [null, Validators.required],
      paisNacimiento: [null, Validators.required],
      dptoNacimiento: [null, Validators.required],
      municipioNacimiento: [null, Validators.required],
      autorreconocimiento: [null, Validators.required],
      discapacidad: [null, Validators.required],
      infoDiscapacidad: null,
      direccion: ['', Validators.required],
      barrio: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
      ],
      criterio: [null, Validators.required],
      infoCriterio: [null, Validators.required],
      tipoResponsable: [null, Validators.required],
      uds: [null, Validators.required],
      ingreso: [null, Validators.required],
      comentario: null,
      fecha: null,
      estado: '',
      egreso: null, // lo toma como obligatorio
      motivoEgreso: '',
      creadoPor: ''
    });
    this.formAcudiente = this.formBuilder.group({
      _id: '',
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
      nombre2: null,
      apellido1: [null, Validators.required],
      apellido2: null,
      sexo: [null, Validators.required],
      nacimiento: [null, Validators.required],
      paisNacimiento: [null, Validators.required],
      dptoNacimiento: [null, Validators.required],
      municipioNacimiento: [null, Validators.required]
    });
    this.formMadre = this.formBuilder.group({
      _id: '',
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
      nombre2: null,
      apellido1: [null, Validators.required],
      apellido2: null,
      sexo: [null, Validators.required],
      nacimiento: [null, Validators.required]
    });
    this.formPadre = this.formBuilder.group({
      _id: '',
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
      nombre2: null,
      apellido1: [null, Validators.required],
      apellido2: null,
      sexo: [null, Validators.required],
      nacimiento: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.dialog.closeAll();
  }

  ngOnDestroy(): void {
    return;
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.id)
    );
  }

  obtenerBeneficiario(id: string): Promise<Beneficiario> {
    return new Promise((resolve, reject) => {
      this.beneficiario$
        .obtenerBeneficiario_responsables(id)
        .subscribe((resp: any) => {
          if (resp.ok) {
            resolve(resp.beneficiario);
          } else {
            reject(resp);
          }
        });
    });
  }

  obtenerUds() {
    switch (this.usuario.rol) {
      case 'ADMIN':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'GESTOR':
        this.query = `gestor=${this.usuario._id}`;
        break;
      case 'COORDINADOR':
        this.query = `coordinador=${this.usuario._id}`;
        break;
      default:
        this.query = `docentes=${this.usuario._id}`;
        break;
    }
    // Si ya ha consultado una vez sólo toma los datos del LS
    const udsEnLocal = localStorage.getItem('udsAsignadas');
    if (udsEnLocal !== null) {
      this.udsAsignadas = JSON.parse(udsEnLocal);
    } else {
      this.uds$.obtenerUds(this.query).subscribe((resp: any) => {
        if (resp.ok) {
          this.udsAsignadas = resp.uds;
          localStorage.setItem(
            'udsAsignadas',
            JSON.stringify(this.udsAsignadas)
          );
        }
      });
    }
  }

  // Form beneficiario
  get fb() {
    return this.formBeneficiario;
  }
  get fbc() {
    return this.formBeneficiario.controls;
  }
  get fbv() {
    return this.formBeneficiario.value;
  }
  get fbrv() {
    return this.formBeneficiario.getRawValue();
  }
  // Form acudiente
  get fa() {
    return this.formAcudiente;
  }
  get fac() {
    return this.formAcudiente.controls;
  }
  get fav() {
    return this.formAcudiente.value;
  }
  get farv() {
    return this.formAcudiente.getRawValue();
  }
  // Form madre
  get fm() {
    return this.formMadre;
  }
  get fmc() {
    return this.formMadre.controls;
  }
  get fmv() {
    return this.formMadre.value;
  }
  get fmrv() {
    return this.formMadre.getRawValue();
  }
  // Form acudiente
  get fp() {
    return this.formPadre;
  }
  get fpc() {
    return this.formPadre.controls;
  }
  get fpv() {
    return this.formPadre.value;
  }
  get fprv() {
    return this.formPadre.getRawValue();
  }

  limpiarEspaciosForm(form: FormGroup) {
    Object.keys(form.controls).forEach(key =>
      form.get(key).setValue(form.get(key).value.trim())
    );
  }

  limpiarEspaciosObjeto(obj: any) {
    Object.keys(obj).map(
      k => (obj[k] = typeof obj[k] === 'string' ? obj[k].trim() : obj[k])
    );
  }

  patchFormulario(data: Beneficiario) {
    // Form beneficiario
    this.cambiarDepartamentos(data.paisNacimiento);
    this.cambiarCiudades(data.dptoNacimiento);
    this.fb.patchValue({
      tipoDoc: data.tipoDoc,
      documento: data.documento,
      nombre1: data.nombre1,
      nombre2: data.nombre2,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      sexo: data.sexo,
      nacimiento: new Date(moment(data.nacimiento, 'DD/MM/YYYY')),
      paisNacimiento: data.paisNacimiento,
      dptoNacimiento: data.dptoNacimiento,
      municipioNacimiento: data.municipioNacimiento,
      autorreconocimiento: data.autorreconocimiento,
      discapacidad: data.discapacidad,
      direccion: data.direccion,
      barrio: data.barrio,
      telefono: data.telefono,
      criterio: data.criterio,
      infoCriterio: data.infoCriterio,
      tipoResponsable: data.tipoResponsable,
      uds: data.uds._id,
      ingreso: new Date(moment(data.ingreso, 'DD/MM/YYYY')),
      comentario: data.comentario,
      estado: data.estado,
      motivoEgreso: data.motivoEgreso,
      creadoPor: data.creadoPor._id || ''
    });
    if (data.egreso === '' || data.egreso === null) {
      this.haEgresado = false;
      this.validarEgreso();
    } else {
      this.haEgresado = true;
      this.validarEgreso();
      this.fb.patchValue({
        egreso: new Date(moment(data.egreso, 'DD/MM/YYYY'))
      });
    }
    // Form acudiente
    this.cambiarDepartamentosResp(data.responsableId.paisNacimiento);
    this.cambiarCiudadesResp(data.responsableId.dptoNacimiento);
    this.fa.patchValue({
      tipoDoc: data.responsableId.tipoDoc,
      documento: data.responsableId.documento,
      nombre1: data.responsableId.nombre1.toUpperCase(),
      nombre2: data.responsableId.nombre2.toUpperCase(),
      apellido1: data.responsableId.apellido1.toUpperCase(),
      apellido2: data.responsableId.apellido2.toUpperCase(),
      sexo: data.responsableId.sexo,
      nacimiento: new Date(moment(data.responsableId.nacimiento, 'DD/MM/YYYY')),
      paisNacimiento: data.responsableId.paisNacimiento,
      dptoNacimiento: data.responsableId.dptoNacimiento,
      municipioNacimiento: data.responsableId.municipioNacimiento
    });
    // Form madre
    if (data.madreId !== null) {
      this.fm.patchValue({
        tipoDoc: data.madreId.tipoDoc,
        documento: data.madreId.documento,
        nombre1: data.madreId.nombre1.toUpperCase(),
        nombre2: data.madreId.nombre2.toUpperCase(),
        apellido1: data.madreId.apellido1.toUpperCase(),
        apellido2: data.madreId.apellido2.toUpperCase(),
        sexo: data.madreId.sexo,
        nacimiento: new Date(moment(data.madreId.nacimiento, 'DD/MM/YYYY'))
      });
    } else {
      this.tieneMadre = false;
      this.validarMadre();
    }
    if (data.padreId !== null) {
      this.fp.patchValue({
        tipoDoc: data.padreId.tipoDoc,
        documento: data.padreId.documento,
        nombre1: data.padreId.nombre1.toUpperCase(),
        nombre2: data.padreId.nombre2.toUpperCase(),
        apellido1: data.padreId.apellido1.toUpperCase(),
        apellido2: data.padreId.apellido2.toUpperCase(),
        sexo: data.padreId.sexo,
        nacimiento: new Date(moment(data.padreId.nacimiento, 'DD/MM/YYYY'))
      });
    } else {
      this.tienePadre = false;
      this.validarPadre();
    }
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
        this.formBeneficiario.get('autorreconocimiento').patchValue('Ninguno');
      } else {
        this.listaDepartamentos = listaDatosColombia;
        this.formBeneficiario.get('autorreconocimiento').patchValue([]);
      }
    } else {
      // Sino, lo recibí de un select
      if (pais !== 'Colombia') {
        this.listaDepartamentos = [{ departamento: 'Extranjero' }];
        this.formBeneficiario.get('autorreconocimiento').patchValue('Ninguno');
      } else {
        this.listaDepartamentos = listaDatosColombia;
        this.formBeneficiario.get('autorreconocimiento').patchValue([]);
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
      if (departamento.value === 'Extranjero') {
        this.listaMunicipios = ['Extranjero'];
      } else {
        const i = this.listaDepartamentos.findIndex(
          (data: any) => data.departamento === departamento.value
        );
        this.listaMunicipios = this.listaDepartamentos[i].ciudades;
        // console.log(this.listaMunicipios, 'lista mun');
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
        // console.log(this.listaMunicipios, 'lista mun');
      }
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

  comprobarSD($event: any, formulario: string) {
    switch (formulario) {
      case 'acudiente':
        if ($event.value === 'SD') {
          const documentoAleatorio = this.generarDocumento(13);
          this.fa.get('documento').patchValue(documentoAleatorio);
        } else {
          this.fa.get('documento').patchValue('');
        }
        break;
      case 'madre':
        if ($event.value === 'SD') {
          const documentoAleatorio = this.generarDocumento(13);
          this.fm.get('documento').patchValue(documentoAleatorio);
        } else {
          this.fm.get('documento').patchValue('');
        }
        break;
      case 'padre':
        if ($event.value === 'SD') {
          const documentoAleatorio = this.generarDocumento(13);
          this.fp.get('documento').patchValue(documentoAleatorio);
        } else {
          this.fp.get('documento').patchValue('');
        }
        break;

      default:
        if ($event.value === 'SD') {
          const documentoAleatorio = this.generarDocumento(13);
          this.fb.get('documento').patchValue(documentoAleatorio);
        } else {
          this.fb.get('documento').patchValue('');
        }
        break;
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

  cambiarCodigoUds($event: any) {
    if ($event === undefined) {
      return;
    }
    const index = this.udsAsignadas.findIndex(
      (unidad: Uds) => unidad._id === $event.value
    );
    this.codigoUdsSeleccionada = this.udsAsignadas[index].codigo;
  }

  validarMadre() {
    if (this.tieneMadre) {
      this.fm.get('tipoDoc').enable();
      this.fm.get('documento').enable();
      this.fm.get('nombre1').enable();
      this.fm.get('nombre2').enable();
      this.fm.get('apellido1').enable();
      this.fm.get('apellido2').enable();
      this.fm.get('nacimiento').enable();
      this.fm.get('sexo').enable();
    } else {
      this.fm.get('tipoDoc').patchValue(null);
      this.fm.get('documento').patchValue(null);
      this.fm.get('nombre1').patchValue(null);
      this.fm.get('nombre2').patchValue('');
      this.fm.get('apellido1').patchValue(null);
      this.fm.get('apellido2').patchValue('');
      this.fm.get('nacimiento').patchValue(null);
      this.fm.get('sexo').patchValue(null);
      this.fm.get('tipoDoc').disable();
      this.fm.get('documento').disable();
      this.fm.get('nombre1').disable();
      this.fm.get('nombre2').disable();
      this.fm.get('apellido1').disable();
      this.fm.get('apellido2').disable();
      this.fm.get('nacimiento').disable();
      this.fm.get('sexo').disable();
    }
  }
  validarPadre() {
    if (this.tienePadre) {
      this.fp.get('tipoDoc').enable();
      this.fp.get('documento').enable();
      this.fp.get('nombre1').enable();
      this.fp.get('nombre2').enable();
      this.fp.get('apellido1').enable();
      this.fp.get('apellido2').enable();
      this.fp.get('nacimiento').enable();
      this.fp.get('sexo').enable();
    } else {
      this.fp.get('tipoDoc').patchValue(null);
      this.fp.get('documento').patchValue(null);
      this.fp.get('nombre1').patchValue(null);
      this.fp.get('nombre2').patchValue('');
      this.fp.get('apellido1').patchValue(null);
      this.fp.get('apellido2').patchValue('');
      this.fp.get('nacimiento').patchValue(null);
      this.fp.get('sexo').patchValue(null);
      this.fp.get('tipoDoc').disable();
      this.fp.get('documento').disable();
      this.fp.get('nombre1').disable();
      this.fp.get('nombre2').disable();
      this.fp.get('apellido1').disable();
      this.fp.get('apellido2').disable();
      this.fp.get('nacimiento').disable();
      this.fp.get('sexo').disable();
    }
  }

  validarEgreso() {
    if (!this.haEgresado) {
      this.fb.get('egreso').disable();
      this.fb.get('motivoEgreso').disable();
    } else {
      this.fb.get('egreso').enable();
      this.fb.get('motivoEgreso').enable();
    }
  }

  procesarFormulario(nombreForm: string) {
    switch (nombreForm) {
      case 'beneficiario':
        this.fbv._id = this.beneficiario._id;
        this.fbv.documento = this.fbv.documento.split('.').join('');
        this.fbv.nacimiento = moment(this.fbv.nacimiento).format('DD/MM/YYYY');
        this.fbv.ingreso = moment(this.fbv.ingreso).format('DD/MM/YYYY');
        if (this.fbv.egreso) {
          this.fbv.egreso = moment(this.fbv.egreso).format('DD/MM/YYYY');
        }
        break;
      case 'acudiente':
        this.fav._id = this.beneficiario.responsableId._id;
        this.fav.documento = this.fav.documento.split('.').join('');
        this.fav.nacimiento = moment(this.fav.nacimiento).format('DD/MM/YYYY');
        break;
      case 'madre':
        this.fmv._id = this.beneficiario.madreId._id;
        this.fmv.documento = this.fmv.documento.split('.').join('');
        this.fmv.nacimiento = moment(this.fmv.nacimiento).format('DD/MM/YYYY');
        break;
      case 'padre':
        this.fpv._id = this.beneficiario.padreId._id;
        this.fpv.documento = this.fpv.documento.split('.').join('');
        this.fpv.nacimiento = moment(this.fpv.nacimiento).format('DD/MM/YYYY');
        break;

      default:
        this.fbv._id = this.beneficiario._id;
        this.fbv.nacimiento = moment(this.fbv.nacimiento).format('DD/MM/YYYY');
        this.fbv.ingreso = moment(this.fbv.ingreso).format('DD/MM/YYYY');
        if (this.fbv.egreso) {
          this.fbv.egreso = moment(this.fbv.egreso).format('DD/MM/YYYY');
        }
        break;
    }
  }

  actualizarBeneficiario() {
    // if (this.fb.invalid) {
    //   this.fb.markAllAsTouched();
    //   return;
    // }
    this.procesarFormulario('beneficiario');
    console.log(this.fb.value, 'form');
    this.beneficiario$
      .actualizarBeneficiario(this.fb.value)
      .subscribe((resp: any) => {
        if (resp.ok) {
          alertSuccess.fire('Beneficiario actualizado');
        }
      });
    return;
  }

  actualizarAcudiente() {
    if (this.fa.invalid) {
      this.fa.markAllAsTouched();
      return;
    }
    this.procesarFormulario('acudiente');
    this.responsable$
      .actualizarResponsable(this.fa.value)
      .subscribe((resp: any) => {
        if (resp.ok) {
          alertSuccess.fire('Acudiente actualizado');
        }
      });
    return;
  }

  actualizarMadre() {
    if (this.fm.invalid) {
      this.fm.markAllAsTouched();
      return;
    }
    this.procesarFormulario('madre');
    this.madre$.actualizarMadre(this.fmv).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire('Madre actualizada');
      }
    });
    return;
  }

  actualizarPadre() {
    if (this.fp.invalid) {
      this.fp.markAllAsTouched();
      return;
    }
    this.procesarFormulario('padre');
    console.log(this.formPadre.value, 'form padre');
    this.padre$.actualizarPadre(this.fpv).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire('Padre actualizado');
      }
    });
    return;
  }
}
