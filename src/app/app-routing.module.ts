import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuard } from './services/guards/login.guard';
import { AlreadyLoginGuard } from './services/guards/already-login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AlreadyLoginGuard],
    data: {
      paginaActiva: 'Login',
      partes: [
        {
          titulo: 'Login',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
