import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Config } from 'src/app/config/config';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  usuario: Usuario;
  token: string;

  socket: any;
  readonly SocketURI = Config.REST.PRINCIPAL.URL;

  constructor() {
    this.socket = io(this.SocketURI);
    this.socket.on('connect', () => {
      console.log('servidor io conectado!');
    });

    this.socket.on('disconnect', () => {
      console.log('servidor io desconectado!');
    });
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data, () => {
      console.log('El emit se disparó correctamente');
    });
  }
}
