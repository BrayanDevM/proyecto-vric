import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// servicios de error
import { ErrorService } from '../services/errors/error.service';
import { LoggingService } from '../services/errors/logging.service';
import { NotificacionService } from '../services/errors/notificacion.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // El manejador de errores es importanete y debe ser cargado primero.
  // Porque aquí inyectaremos manualmente los servicios con la clase Injector.
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    // manejo de errores personalizados
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificacionService);

    let message: string;
    let stackTrace: string;

    if (error instanceof HttpErrorResponse) {
      // Server Error
      stackTrace = errorService.getServerStack(error);
      // Compruebo errores con status 0 ('sin conexión?)
      if (error.status === 0) {
        // Si no tiene conexión
        if (!navigator.onLine) {
          message = 'No tienes conexión a internet';
        }
      } else {
        message = errorService.getServerMessage(error);
      }
      notifier.showError(message);
    }
    /**
     * Si no es un error de Http muestra error del cliente
     */
    // } else {
    //   // Client Error
    //   message = errorService.getClientMessage(error);
    //   stackTrace = errorService.getClientStack(error);
    //   // No notifico los errores con snackbar
    //   notifier.showError(message);
    // }

    // Always log errors
    logger.logError(message, stackTrace);
    console.error(error);
  }
}
