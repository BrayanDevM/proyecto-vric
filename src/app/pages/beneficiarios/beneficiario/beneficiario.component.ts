import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import listaDatosColombia from 'src/app/config/colombia.json';
import Swal from 'sweetalert2';
import { RespBeneficiariosService } from 'src/app/services/resp-beneficiarios.service';
import { RespBeneficiario } from 'src/app/models/respBeneficiario.model';
import { NgOption } from '@ng-select/ng-select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var moment: any;

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Beneficiario,
    private beneficiarios$: BeneficiariosService,
    private responsables$: RespBeneficiariosService,
    private router: Router,
    private snackBar$: MatSnackBar
  ) {}

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

  editarComentario() {
    console.log('editando...');
  }
}
