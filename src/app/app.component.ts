import { Component } from '@angular/core';
import { NombreTabWebService } from './services/nombre-tab-web.service';
declare var moment: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private nombreTab: NombreTabWebService) {
    moment.locale('es');
  }
}
