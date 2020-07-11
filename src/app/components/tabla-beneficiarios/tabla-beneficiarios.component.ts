import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Router } from '@angular/router';
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-tabla-beneficiarios',
  templateUrl: './tabla-beneficiarios.component.html',
  styleUrls: ['./tabla-beneficiarios.component.css']
})
export class TablaBeneficiariosComponent implements OnInit {
  usuario: Usuario;
  puedeEditar = false;
  @Input() beneficiarios = [];
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
    this.refrescarSelect(200);
  }

  eliminarBeneficiario(beneficiario: Beneficiario) {
    Swal.fire({
      title: 'Beneficiario',
      html: `¿Seguro de que deseas eliminar a <b>${beneficiario.nombre1}</b>?, esta acción no puede deshacerse`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
      if (result.value) {
        this.beneficiarios$.eliminarBeneficiario(beneficiario).subscribe(() => {
          Swal.fire(
            'Beneficiario',
            'Beneficiario eliminado correctamente',
            'success'
          );
          this.realizoCambios.emit(true);
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
        Swal.fire({
          title: 'Beneficiario actualizado',
          text: 'Beneficiario actualizado correctamente',
          icon: 'success'
        });
        this.realizoCambios.emit(true);
      });
  }

  editarBeneficiario(beneficiario: Beneficiario) {
    this.router.navigate(['/beneficiarios', beneficiario._id]);
  }

  refrescarSelect(ms: number) {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, ms);
  }
}
