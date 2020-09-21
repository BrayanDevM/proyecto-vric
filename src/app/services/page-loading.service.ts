import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageLoadingService {
  loadingPages: EventEmitter<boolean> = new EventEmitter();

  constructor() {}
}
