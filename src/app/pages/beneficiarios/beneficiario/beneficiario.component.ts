import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { alertDanger } from 'src/app/helpers/swal2.config';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { Config } from 'src/app/config/config';

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent implements OnInit {
  // variables de configuración
  estados = Config.SELECTS.estadosBeneficiarios;
  estadoData: any;
  estadoInicial: string;

  editandoComentario = false;
  // variables de uso
  beneficiario: Beneficiario;
  comentario: string;

  puedeEditar = false;
  puedeComentar = false;
  edicionRapida = false;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Beneficiario,
    private usuario$: UsuarioService,
    private router: Router,
    private beneficiarios$: BeneficiariosService,
    private snackBar$: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.comprobarPermisos();

    this.comentario = this.data.comentario;
    this.estadoInicial = this.data.estado;
    this.obtenerIconoEstado();
  }

  obtenerIconoEstado() {
    this.estadoData = this.estados.find(
      estado => estado.value === this.data.estado
    );
  }

  cancelarEdicionRapida() {
    this.edicionRapida = false;
    this.data.estado = this.estadoInicial;
  }

  triggerResize() {
    // Espera cambios en textarea para cambiar altura
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {}

  copiar(elementId: any) {
    const element = document.createElement('input');
    element.setAttribute('value', document.getElementById(elementId).innerHTML);
    // obtengo el valor
    const valor: string = element.value;
    let documento = '';
    // si tiene puntos
    if (valor.includes('.')) {
      const parts = valor.split('.');
      parts.forEach(num => {
        documento += num;
      });
    } else {
      documento = valor;
    }
    element.setAttribute('value', documento);
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);

    this.snackBar$.open('Copiado al portapapeles', 'Cerrar', {
      duration: 4500
    });
  }

  cancelarComentario() {
    this.data.comentario = this.comentario;
    this.editandoComentario = false;
  }

  actualizarBeneficiario() {
    let madreId = '';
    let padreId = '';
    const creadoPor = this.data.creadoPor._id;
    if (this.data.madreId !== null) {
      madreId = this.data.madreId._id;
    }
    if (this.data.padreId !== null) {
      padreId = this.data.madreId._id;
    }
    // reasigno _id de populates
    this.beneficiario = new Beneficiario(
      this.data.tipoDoc,
      this.data.documento,
      this.data.nombre1,
      this.data.nombre2,
      this.data.apellido1,
      this.data.apellido2,
      this.data.sexo,
      this.data.nacimiento,
      this.data.paisNacimiento,
      this.data.dptoNacimiento,
      this.data.municipioNacimiento,
      this.data.discapacidad,
      this.data.direccion,
      this.data.barrio,
      this.data.telefono,
      this.data.autorreconocimiento,
      this.data.criterio,
      this.data.infoCriterio,
      this.data.ingreso,
      this.data.tipoResponsable,
      this.data.responsableId._id,
      this.data.estado,
      this.data.uds,
      madreId,
      padreId,
      null,
      this.data.comentario,
      this.data.egreso,
      this.data.creadoEl,
      creadoPor,
      this.data.motivoEgreso,
      this.data._id
    );
    // actualizo registro
    this.beneficiarios$
      .actualizarBeneficiario(this.beneficiario)
      .subscribe((resp: any) => {
        if (resp.ok) {
          this.editandoComentario = false;
          // console.log(this.data, 'en modal');
          this.edicionRapida = false;
          this.snackBar$.open('Beneficiario actualizado', null, {
            duration: 4000
          });
        }
      });
  }

  editarBeneficiario() {
    this.router.navigate(['/beneficiario/editar', this.data._id]);
  }

  eliminarBeneficiario(caso: string): void {
    let mensaje = `<b>${this.data.nombre1} ${this.data.nombre2} ${this.data.apellido1} ${this.data.apellido2}</b>?, esta acción no puede deshacerse.`;
    let confirmBtn = 'Si, cancelar ingreso';
    if (caso === 'Cancela ingreso') {
      mensaje = '¿Deseas cancelar el reporte de ingreso de ' + mensaje;
    } else {
      mensaje = '¿Deseas eliminar a ' + mensaje;
      confirmBtn = 'Si, eliminar';
    }
    alertDanger
      .fire({
        title: 'Beneficiarios',
        html: mensaje,
        confirmButtonText: confirmBtn
      })
      .then(confirm => {
        if (confirm.value) {
          this.beneficiarios$
            .eliminarBeneficiario(this.data)
            .subscribe((resp: any) => {
              if (resp.ok) {
                this.beneficiarios$.beneficiarioEliminado.emit(this.data);
              }
            });
        }
      });
  }

  // permisos para crear
  comprobarPermisos() {
    switch (this.usuario$.usuario.rol) {
      case 'ADMIN':
        this.puedeEditar = true;
        this.puedeComentar = true;
        break;
      case 'GESTOR':
        this.puedeEditar = true;
        this.puedeComentar = true;
        break;
      case 'DOCENTE':
        this.puedeComentar = true;
        break;
      default:
        this.puedeEditar = false;
        break;
    }
  }
}
