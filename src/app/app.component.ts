import { Component } from '@angular/core';
declare var moment: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    moment.locale('es');
  }
}
