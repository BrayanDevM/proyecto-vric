import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socketIo/socket.service';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { VersionAppService } from 'src/app/services/version-app.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  usuario: Usuario;
  usuarioRol: string;
  menuUsuario: any = [];
  versionApp = '';

  abrirNotificaciones = false;
  notificaciones: any[] = [];
  iconoNotificacion = 'notifications_none';
  cuentaSinLeer = 0;

  audio: any;

  @ViewChild(CdkConnectedOverlay) private connectedOverlay: CdkConnectedOverlay;

  constructor(
    private usuario$: UsuarioService,
    private sidebar$: SidebarService,
    private notificaciones$: NotificacionesService,
    private socket: SocketService,
    private router: Router,
    private versionApp$: VersionAppService
  ) {
    this.audio = new Audio('assets/audio/notificaciones/cheerful.mp3');
    this.versionApp = this.versionApp$.versionActual;
  }

  ngOnInit(): void {
    this.usuario = this.usuario$.usuario;
    this.menuUsuario = this.sidebar$.obtenerMenu();
    this.obtenerNotificaciones();
    this.subsNotificaciones();
  }

  ngAfterViewInit() {
    this.connectedOverlay.backdropClick.subscribe(
      () => (this.abrirNotificaciones = false)
    );
  }

  irAjustes(): void {
    this.router.navigate(['/ajustes']);
  }
  irAyuda(): void {
    this.router.navigate(['/ayuda']);
  }

  cerrarSesion(): void {
    this.usuario$.logout();
  }

  // Control de notificaciones ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  obtenerNotificaciones() {
    this.notificaciones$
      .obtenerNotificaciones(this.usuario._id)
      .subscribe((resp: any) => {
        resp.notificaciones.forEach((notificacion: any) => {});
        this.notificaciones = resp.notificaciones;
        this.contarSinLeer();
      });
  }

  subsNotificaciones() {
    // Generales
    this.socket
      .listen('enviarNotificacionGeneral')
      .subscribe((notificacion: any) => {
        this.notificaciones.unshift(notificacion.creada);
        this.cuentaSinLeer++;
        this.audio.play();
      });

    // Para usuario
    this.socket.listen('notificarUsuario').subscribe((notificacion: any) => {
      console.log(notificacion, 'notif para usuario');
      if (notificacion.creada.paraUsuarios.includes(this.usuario._id)) {
        this.notificaciones.unshift(notificacion.creada);
        this.cuentaSinLeer++;
        this.audio.play();
      }
    });
  }

  contarSinLeer() {
    let contador = 0;
    this.cuentaSinLeer = 0;
    this.notificaciones.forEach((notificacion: any) => {
      if (!notificacion.leidaPor.includes(this.usuario._id)) {
        this.cuentaSinLeer++;
      }
      contador++;
      if (contador === this.notificaciones.length) {
        if (this.cuentaSinLeer > 0) {
          this.iconoNotificacion = 'notifications_active';
          this.audio.play();
        }
      }
    });
  }

  marcarComoLeida(notificacion: any) {
    this.socket.emit('marcarComoLeida', {
      _id: notificacion._id,
      leidaPor: this.usuario._id
    });
    this.cuentaSinLeer--;
  }

  marcarComoNoLeida(notificacion: any) {
    this.socket.emit('marcar_ComoSinLeer', {
      _id: notificacion._id,
      leidaPor: this.usuario._id
    });
    this.cuentaSinLeer++;
  }
}
