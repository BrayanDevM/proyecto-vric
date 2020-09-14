import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SocketService } from '../../services/socketIo/socket.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  usuarioId: string;
  @Input() notificaciones: any[] = [];
  @Input() sinLeer = 0;
  @Output() marcarComoLeida: EventEmitter<any> = new EventEmitter();
  @Output() marcarComoNoLeida: EventEmitter<any> = new EventEmitter();

  constructor(private usuario$: UsuarioService) {
    this.usuarioId = this.usuario$.usuario._id;
  }

  ngOnInit(): void {}

  notificacionLeida(notificacion: any) {
    notificacion.leidaPor.push(this.usuarioId);
    this.marcarComoLeida.emit(notificacion);
  }

  notificacionNoLeida(notificacion: any) {
    const i = notificacion.leidaPor.findIndex((id: string) => {
      return (id = this.usuarioId);
    });
    notificacion.leidaPor.splice(i, 1);
    this.marcarComoNoLeida.emit(notificacion);
  }
}
