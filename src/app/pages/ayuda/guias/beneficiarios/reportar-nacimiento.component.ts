import { Component, OnInit } from '@angular/core';
declare const moment: any;

@Component({
  selector: 'app-reportar-nacimiento',
  templateUrl: './reportar-nacimiento.component.html',
  styles: []
})
export class ReportarNacimientoComponent implements OnInit {
  fechaDeGuia = moment('18/10/2020', 'DD/MM/YYYY').fromNow();

  constructor() {}

  ngOnInit(): void {}
}
