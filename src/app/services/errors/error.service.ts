import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No tienes conexión a internet';
    }
    return error.message ? error.message : error.toString();
  }

  getClientStack(error: Error): string {
    return error.stack;
  }

  getServerMessage(error: HttpErrorResponse): string {
    // error principal
    // return error.message;

    // error personalizado en servidor
    return error.error.mensaje;
  }

  getServerStack(error: HttpErrorResponse): string {
    // Manejo de trazabilidad stack
    return 'stack';
  }
}
