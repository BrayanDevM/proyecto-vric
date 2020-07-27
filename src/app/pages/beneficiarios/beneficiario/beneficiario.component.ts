import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import listaDatosColombia from 'src/app/config/colombia.json';
import Swal from 'sweetalert2';
import { RespBeneficiariosService } from 'src/app/services/resp-beneficiarios.service';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
import { NgOption } from '@ng-select/ng-select';
declare var moment: any;

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent implements OnInit {
  beneficiario: Beneficiario;
  responsable: RespBeneficiario;

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
  // Para responsable (acudiente)
  listaDepartamentosResp: any = listaDatosColombia;
  listaMunicipiosResp: any = [{ ciudades: 'Extranjero' }];
  respExiste = false;
  // Configuración dinámica para criterio carta/puntaje
  tipoInputInfoCriterio = 'text';
  labelInputInfoCriterio = 'Detalle criterio';

  // elements
  @ViewChild('infoCriterio') iInfoCriterio: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private beneficiarios$: BeneficiariosService,
    private responsables$: RespBeneficiariosService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.beneficiarios$
        .obtenerBeneficiario(params.id)
        .subscribe((resp: any) => {
          this.beneficiario = resp.beneficiario;
          this.obtenerResponsable(this.beneficiario.responsableId);
          this.beneficiario.nacimiento = moment(
            this.beneficiario.nacimiento,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD');
          this.beneficiario.ingreso = moment(
            this.beneficiario.ingreso,
            'DD/MM/YYYY'
          ).format('YYYY-MM-DD');
          this.cambiarDepartamentos(this.beneficiario.paisNacimiento);
          this.cambiarCiudades(this.beneficiario.dptoNacimiento);
        });
    });
  }

  obtenerResponsable(id: string) {
    this.responsables$.obtenerResponsable(id).subscribe((resp: any) => {
      this.responsable = resp.responsable;
      this.responsable.nacimiento = moment(
        this.responsable.nacimiento,
        'DD/MM/YYYY'
      ).format('YYYY-MM-DD');
      this.cambiarDepartamentosResp(this.responsable.paisNacimiento);
      this.cambiarCiudadesResp(this.responsable.dptoNacimiento);
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

  actualizarBeneficiario() {
    this.beneficiario.nacimiento = moment(
      this.beneficiario.nacimiento,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
    this.beneficiario.ingreso = moment(
      this.beneficiario.ingreso,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
    this.beneficiario.egreso = moment(
      this.beneficiario.egreso,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
    this.beneficiarios$
      .actualizarBeneficiario(this.beneficiario)
      .subscribe((resp: any) => {
        Swal.fire({
          title: 'Actualizar beneficiario',
          // tslint:disable-next-line: max-line-length
          html: `Se ha actualizado correctamente a
          <b>${this.beneficiario.nombre1} ${this.beneficiario.nombre2}
          ${this.beneficiario.apellido1} ${this.beneficiario.apellido2}</b>`,
          icon: 'success'
        });
        this.router.navigate(['/beneficiarios/mis-beneficiarios']);
      });
  }

  actualizarResponsable() {
    this.responsable.nacimiento = moment(
      this.responsable.nacimiento,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');
    this.responsables$
      .actualizarResponsable(this.responsable)
      .subscribe((resp: any) => {
        if (resp.ok) {
          Swal.fire({
            title: 'Actualizar responsable',
            // tslint:disable-next-line: max-line-length
            html: `Se ha actualizado correctamente a
            <b>${this.responsable.nombre1} ${this.responsable.nombre2}
            ${this.responsable.apellido1} ${this.responsable.apellido2}</b>`,
            icon: 'success'
          });
          this.router.navigate(['/beneficiarios/mis-beneficiarios']);
        }
      });
  }
}
