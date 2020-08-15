import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent implements OnInit {
  editando = false;
  beneficiario: Beneficiario;
  comentario: string;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Beneficiario,
    private beneficiarios$: BeneficiariosService,
    private snackBar$: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.comentario = this.data.comentario;
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
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  cancelarComentario() {
    this.data.comentario = this.comentario;
    this.editando = false;
  }

  guardarComentario() {
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
          this.editando = false;
          console.log(this.data, 'en modal');

          this.snackBar$.open('Comentario actualizado', null, {
            duration: 4000
          });
        }
      });
  }
}
