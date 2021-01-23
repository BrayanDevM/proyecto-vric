import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-update-notes',
  templateUrl: './update-notes.component.html',
  styleUrls: ['./update-notes.component.css']
})
export class UpdateNotesComponent implements AfterViewInit {
  @ViewChild('dialog') updateNotesDialog: ElementRef;

  constructor() {
    this.eliminarNotasAnteriores();
  }

  ngAfterViewInit(): void {
    this.ocultarReleaseNotes();
  }

  /**
   * Confirma que se han laído las notas y se guarda en el LS
   */
  entendido(): void {
    this.updateNotesDialog.nativeElement.classList.add('d-none');
    localStorage.setItem('ReleaseNotes-v1.1.0', 'true'); // cambiar en ocultarReleaseNotes() también
  }

  masTarde(): void {
    this.updateNotesDialog.nativeElement.classList.add('d-none');
  }

  eliminarNotasAnteriores(): void {
    // Modales de la beta ------------------------------------
    localStorage.removeItem('cerrarUpdateModal');
    localStorage.removeItem('cerrarUpdateModal-v1.5.1');
    localStorage.removeItem('cerrarUpdateModal-v1.6.0');
    localStorage.removeItem('cerrarUpdateModal-v1.6.1');
    // -------------------------------------------------------
    localStorage.removeItem('ReleaseNotes-v1.0.1');
    localStorage.removeItem('ReleaseNotes-v1.0.2');
  }

  /**
   * Oculta ventana notas de versión si el usuario ya las ha visto
   * y ha dado en botón entendido
   */
  ocultarReleaseNotes() {
    const notasVistas = localStorage.getItem('ReleaseNotes-v1.1.0');
    if (notasVistas === 'true') {
      this.updateNotesDialog.nativeElement.classList.add('d-none');
      return;
    }
  }
}
