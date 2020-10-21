import { Component, OnInit } from '@angular/core';
declare const moment: any;

@Component({
  selector: 'app-que-es-esta-app',
  templateUrl: './que-es-esta-app.component.html',
  styles: []
})
export class QueEsEstaAppComponent implements OnInit {
  fechaDeGuia = moment('18/10/2020', 'DD/MM/YYYY').fromNow();

  constructor() {}

  ngOnInit(): void {}
}
