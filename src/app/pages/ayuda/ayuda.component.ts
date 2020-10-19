import { Component, OnInit } from '@angular/core';
import { PageLoadingService } from 'src/app/services/page-loading.service';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {
  rutaHijaActiva = false;

  constructor(private pageLoading$: PageLoadingService) {}

  ngOnInit(): void {
    this.pageLoading$.loadingPages.emit(false);
  }
}
