import { Component, OnInit, Input } from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import Swal from 'sweetalert2';
declare var jQuery: any;

@Component({
  selector: 'app-info-beneficiario',
  templateUrl: './info-beneficiario.component.html',
  styleUrls: ['./info-beneficiario.component.css']
})
export class InfoBeneficiarioComponent implements OnInit {
  @Input() beneficiarioInfo: Beneficiario = null;
  editarComentario = false;

  constructor(private beneficiarios$: BeneficiariosService) {
    jQuery('[data-toggle="popover"]').popover({
      trigger: 'hover'
    });
  }

  ngOnInit() {}

  actualizarComentario() {
    this.beneficiarios$
      .actualizarBeneficiario(this.beneficiarioInfo)
      .subscribe((resp: any) => {
        if (resp.ok === true) {
          Swal.fire({
            title: 'Comentario',
            text: 'Comentario actualizado correctamente',
            icon: 'success'
          });
          this.editarComentario = false;
        }
      });
  }
}
