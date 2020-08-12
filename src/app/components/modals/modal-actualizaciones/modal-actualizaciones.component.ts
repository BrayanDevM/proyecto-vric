import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-actualizaciones',
  templateUrl: './modal-actualizaciones.component.html',
  styleUrls: ['./modal-actualizaciones.component.css']
})
export class ModalActualizacionesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  actualizacionVista() {
    localStorage.setItem('cerrarUpdateModal-v1.6.0', 'true');
  }
}
