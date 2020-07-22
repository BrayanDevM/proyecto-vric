import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Router } from '@angular/router';
import { NgOption } from '@ng-select/ng-select';
import {
  alertDanger,
  alertSuccess,
  alertError
} from 'src/app/helpers/swal2.config';
declare var jQuery: any;

@Component({
  selector: 'app-tabla-beneficiarios',
  templateUrl: './tabla-beneficiarios.component.html',
  styleUrls: ['./tabla-beneficiarios.component.css']
})
export class TablaBeneficiariosComponent implements OnInit {
  usuario: Usuario;
  puedeEditar = false;

  // ng-select -------------------
  estados: NgOption = [
    { value: 'Vinculado', label: 'Vinculado' },
    { value: 'Dato sensible', label: 'Dato sensible' },
    { value: 'Concurrencia', label: 'Concurrencia' },
    { value: 'Desvinculado', label: 'Desvinculado' },
    { value: 'Pendiente vincular', label: 'Pendiente vincular' },
    { value: 'Pendiente desvincular', label: 'Pendiente desvincular' }
  ];
  // -----------------------------

  @Input() beneficiarios: Beneficiario[] = [];
  @Output() realizoCambios: EventEmitter<boolean> = new EventEmitter();
  @Output() beneficiarioInfo: EventEmitter<Beneficiario> = new EventEmitter();

  constructor(
    private usuarios$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private router: Router
  ) {
    this.usuario = this.usuarios$.usuario;
    if (this.usuario.rol === 'GESTOR' || this.usuario.rol === 'ADMIN') {
      this.puedeEditar = true;
    } else {
      this.puedeEditar = false;
    }
  }

  ngOnInit() {
    jQuery('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  eliminarBeneficiario(beneficiario: Beneficiario) {
    alertDanger
      .fire({
        title: 'Bebenficiarios',
        html: `¿Seguro de que deseas eliminar a <b>${beneficiario.nombre1}</b>?, esta acción no puede deshacerse`,
        confirmButtonText: 'Sí, eliminar'
      })
      .then((result: any) => {
        if (result.value) {
          this.beneficiarios$
            .eliminarBeneficiario(beneficiario)
            .subscribe((resp: any) => {
              if (resp.ok) {
                alertSuccess.fire({
                  title: 'Beneficiario eliminado'
                });
                this.realizoCambios.emit(true);
              } else {
                alertError.fire({
                  title: 'Beneficiarios',
                  text:
                    'No se ha podido eliminar el beneficiario, intentelo nuevamente.'
                });
              }
            });
        }
      });
  }

  verInfoBeneficiario(beneficiario: Beneficiario) {
    this.beneficiarioInfo.emit(beneficiario);
  }

  actualizarBeneficiario(beneficiario: Beneficiario) {
    this.beneficiarios$
      .actualizarBeneficiario(beneficiario)
      .subscribe((resp: any) => {
        alertSuccess.fire({
          title: 'Beneficiario actualizado'
        });
        this.realizoCambios.emit(true);
      });
  }

  editarBeneficiario(beneficiario: Beneficiario) {
    this.router.navigate(['/beneficiarios', beneficiario._id]);
  }
}
