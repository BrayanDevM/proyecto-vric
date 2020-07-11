import { Component, OnInit } from '@angular/core';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
  contratos: Contrato[] = [];
  cargando = false;

  constructor(public contratos$: ContratosService, private router: Router) {}

  ngOnInit() {
    this.obtenerContratos();
  }

  obtenerContratos() {
    this.cargando = true;
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok) {
        this.cargando = false;
        this.contratos = resp.contratos;
      } else {
        this.cargando = false;
      }
    });
  }

  crear() {
    this.router.navigate(['/contratos/crear']);
  }

  eliminarContrato(contrato: Contrato) {
    Swal.fire({
      title: 'Eliminar',
      html: `¿Estás seguro que deseas eliminar el contrato <b>${contrato.codigo}</b>?, esta acción no puede deshacerse`,
      icon: 'warning',
      confirmButtonColor: '#f44234',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.contratos$.eliminarContrato(contrato).subscribe(() => {
          Swal.fire({
            title: 'Eliminado',
            text: 'El contrato ha sido eliminado',
            icon: 'success'
          });
          this.obtenerContratos();
        });
      }
    });
  }
}
