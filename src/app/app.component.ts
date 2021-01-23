import { Component } from '@angular/core';
import { NombreTabWebService } from './services/nombre-tab-web.service';
import { VersionAppService } from './services/version-app.service';
declare const moment: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  versionActual = '1.1.0';

  constructor(
    private verisonApp$: VersionAppService,
    private nombreTab: NombreTabWebService
  ) {
    moment.locale('es');
    this.verisonApp$.compararVersion();
  }
}
