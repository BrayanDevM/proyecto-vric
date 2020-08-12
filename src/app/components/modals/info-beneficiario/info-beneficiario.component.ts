import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { alertSuccess } from 'src/app/helpers/swal2.config';
declare var moment: any;

@Component({
  selector: 'app-info-beneficiario',
  templateUrl: './info-beneficiario.component.html',
  styleUrls: ['./info-beneficiario.component.css']
})
export class InfoBeneficiarioComponent implements OnInit, OnChanges {
  @Input() beneficiarioInfo: Beneficiario = null;
  editarComentario = false;

  constructor(private beneficiarios$: BeneficiariosService) {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.beneficiarioInfo, 'beneficiario recibido');
  }

  actualizarComentario() {
    this.beneficiarios$
      .actualizarBeneficiario(this.beneficiarioInfo)
      .subscribe((resp: any) => {
        if (resp.ok === true) {
          alertSuccess.fire({
            title: 'Comentario actualizado'
          });
          this.editarComentario = false;
        }
      });
  }
}
