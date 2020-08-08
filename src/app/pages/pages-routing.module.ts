import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Páginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContratosComponent } from './contratos/contratos.component';
import { ContratoComponent } from './contratos/contrato/contrato.component';
import { UdsComponent } from './uds/uds.component';
import { NovedadesComponent } from './beneficiarios/novedades/novedades.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { BeneficiarioComponent } from './beneficiarios/beneficiario/beneficiario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UnidadComponent } from './uds/unidad/unidad.component';
import { CrearUdsComponent } from './uds/crear-uds/crear-uds.component';
import { CrearContratoComponent } from './contratos/crear-contrato/crear-contrato.component';
import { MisBeneficiariosComponent } from './beneficiarios/mis-beneficiarios/mis-beneficiarios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdministrarComponent } from './administrar/administrar.component';

// Guards
import { AdminGuard } from '../services/guards/admin.guard';
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { DashboardUdsComponent } from './dashboard/dashboard-uds/dashboard-uds.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [VerificaTokenGuard],
    component: DashboardComponent,
    data: {
      nombrePagina: 'Dashboard',
      partes: [
        {
          titulo: 'Dashboard',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'dashboard/uds/:id',
    canActivate: [VerificaTokenGuard],
    component: DashboardUdsComponent,
    data: {
      nombrePagina: 'UDS',
      partes: [
        {
          titulo: 'Dashboard',
          url: '/dashboard'
        },
        {
          titulo: 'UDS',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'contratos',
    component: ContratosComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    children: [
      { path: ':id', component: ContratoComponent, outlet: 'contrato' },
      { path: 'crear', component: CrearContratoComponent, outlet: 'nuevo' }
    ],
    data: { nombrePagina: 'Contratos' }
  },
  {
    path: 'uds',
    component: UdsComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    children: [
      { path: ':id', component: UnidadComponent, outlet: 'uds' },
      { path: 'crear', component: CrearUdsComponent, outlet: 'nuevo' }
    ],
    data: { nombrePagina: 'Unidades De Servicio' }
  },
  {
    path: 'beneficiarios',
    canActivate: [VerificaTokenGuard],
    component: BeneficiariosComponent,
    data: {
      nombrePagina: 'Beneficiarios',
      partes: [
        {
          titulo: 'Beneficiarios',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'beneficiarios/mis-beneficiarios',
    canActivate: [VerificaTokenGuard],
    component: MisBeneficiariosComponent,
    data: {
      nombrePagina: 'Mis Beneficiarios',
      partes: [
        {
          titulo: 'Beneficiarios',
          url: '/beneficiarios'
        },
        {
          titulo: 'Mis Beneficiarios',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'beneficiarios/novedades',
    canActivate: [VerificaTokenGuard],
    component: NovedadesComponent,
    data: {
      nombrePagina: 'Novedades',
      partes: [
        {
          titulo: 'Beneficiarios',
          url: '/beneficiarios'
        },
        {
          titulo: 'Novedades',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'beneficiarios/:id',
    canActivate: [VerificaTokenGuard],
    component: BeneficiarioComponent,
    data: {
      nombrePagina: 'Ver beneficiario',
      partes: [
        {
          titulo: 'Beneficiarios',
          url: '/beneficiarios'
        },
        {
          titulo: 'Ver beneficiario',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'administrar',
    component: AdministrarComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      nombrePagina: 'Administrar',
      partes: [
        {
          titulo: 'Administrar',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      nombrePagina: 'Usuarios',
      partes: [
        {
          titulo: 'Usuarios',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'usuarios/crear',
    component: CrearUsuarioComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      nombrePagina: 'Crear usuario',
      partes: [
        {
          titulo: 'Usuarios',
          url: '/usuarios'
        },
        {
          titulo: 'Crear usuario',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'usuarios/:id',
    component: UsuarioComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      nombrePagina: 'Editar usuario',
      partes: [
        {
          titulo: 'Usuarios',
          url: '/usuarios'
        },
        {
          titulo: 'Editar usuario',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'perfil',
    canActivate: [VerificaTokenGuard],
    component: PerfilComponent,
    data: {
      nombrePagina: 'Perfil de usuario',
      partes: [
        {
          titulo: 'Perfil de usuario',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'buscar/:criterio',
    canActivate: [VerificaTokenGuard],
    component: BusquedaComponent,
    data: {
      nombrePagina: 'Buscar',
      partes: [
        {
          titulo: 'Buscar',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
