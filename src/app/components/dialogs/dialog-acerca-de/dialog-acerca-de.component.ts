import { Component, OnInit } from '@angular/core';
import { VersionAppService } from 'src/app/services/version-app.service';

@Component({
  selector: 'app-dialog-acerca-de',
  templateUrl: './dialog-acerca-de.component.html',
  styleUrls: ['./dialog-acerca-de.component.css']
})
export class DialogAcercaDeComponent implements OnInit {
  versionApp: string;

  constructor(private versionApp$: VersionAppService) {
    this.versionApp = this.versionApp$.versionActual;
  }

  ngOnInit(): void {}
}
