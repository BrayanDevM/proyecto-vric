import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageLoadingService {
  loadingDashboard: EventEmitter<boolean> = new EventEmitter();

  constructor() {}
}
