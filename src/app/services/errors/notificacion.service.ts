import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  constructor(public snackBar: MatSnackBar, private zone: NgZone) {}

  showSuccess(message: string): void {
    this.snackBar.open(message);
  }

  showError(message: string): void {
    this.zone.run(() => {
      // El segundo parametro es el texto en el botón.
      // El tercero, enviamos una clase css y posición para el snack bar.
      const snackBar = this.snackBar.open(message, 'Cerrar', {
        panelClass: ['error'],
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }
}
