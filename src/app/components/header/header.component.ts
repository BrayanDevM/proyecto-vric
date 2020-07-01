import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  constructor(private usuario$: UsuarioService, private router: Router) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
  }

  logout() {
    this.usuario$.logout();
  }

  buscar(termino: any) {
    this.router.navigate(['/buscar', termino]);
  }
}
