import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import listaDatosColombia from 'src/app/config/colombia.json';
import Swal from 'sweetalert2';
import { RespBeneficiariosService } from 'src/app/services/resp-beneficiarios.service';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent implements OnInit {
  beneficiario: Beneficiario;
  responsable: RespBeneficiario;

  // Variables de uso
  datosColombia: any = listaDatosColombia;
  listaDepartamentos: any = [{ departamento: 'Extranjero' }];
  listaMunicipios = ['Extranjero'];
  // Para responsable (acudiente)
  listaDepartamentosResp: any = [{ departamento: 'Extranjero' }];
  listaMunicipiosResp = ['Extranjero'];
  respExiste = false;
  // Configuración dinámica para criterio carta/puntaje
  tipoInputInfoCriterio = 'text';
  labelInputInfoCriterio = 'Detalle criterio';

  // elements
  @ViewChild('infoCriterio', { static: true }) iInfoCriterio: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private beneficiarios$: BeneficiariosService,
    private responsables$: RespBeneficiariosService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((resp: Params) => {
      this.beneficiarios$
        .obtenerBeneficiario(resp.id)
        .subscribe((respBen: any) => {
          this.beneficiario = respBen.beneficiario;
          this.obtenerResponsable(this.beneficiario.responsableId._id);
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

  refrescarSelect(ms: number) {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, ms);
  }
}
