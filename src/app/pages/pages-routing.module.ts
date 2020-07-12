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

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [VerificaTokenGuard],
    component: DashboardComponent,
    data: {
      paginaActiva: 'Dashboard',
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
    path: 'contratos',
    component: ContratosComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      paginaActiva: 'Contratos',
      partes: [
        {
          titulo: 'Contratos',
          url: '/contratos'
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'contratos/contrato/:id',
    canActivate: [AdminGuard, VerificaTokenGuard],
    component: ContratoComponent,
    data: {
      paginaActiva: 'Ver contrato',
      partes: [
        {
          titulo: 'Contratos',
          url: '/contratos'
        },
        {
          titulo: 'Ver contrato',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'contratos/crear',
    canActivate: [AdminGuard, VerificaTokenGuard],
    component: CrearContratoComponent,
    data: {
      paginaActiva: 'Crear contrato',
      partes: [
        {
          titulo: 'Contratos',
          url: '/contratos'
        },
        {
          titulo: 'Crear contrato',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'uds',
    component: UdsComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      paginaActiva: 'Unidades De Servicio',
      partes: [
        {
          titulo: 'Unidades De Servicio',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'uds/unidad/:id',
    component: UnidadComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      paginaActiva: 'Ver unidad',
      partes: [
        {
          titulo: 'Unidades De Servicio',
          url: '/uds'
        },
        {
          titulo: 'Ver unidad',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'uds/crear',
    component: CrearUdsComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      paginaActiva: 'Crear unidad',
      partes: [
        {
          titulo: 'Unidades De Servicio',
          url: '/uds'
        },
        {
          titulo: 'Crear unidad',
          url: ''
        }
      ],
      gIcono: 'book'
    }
  },
  {
    path: 'beneficiarios',
    canActivate: [VerificaTokenGuard],
    component: BeneficiariosComponent,
    data: {
      paginaActiva: 'Beneficiarios',
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
      paginaActiva: 'Mis Beneficiarios',
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
      paginaActiva: 'Novedades',
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
      paginaActiva: 'Ver beneficiario',
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
      paginaActiva: 'Administrar',
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
      paginaActiva: 'Usuarios',
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
    path: 'usuarios/:id',
    component: UsuarioComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      paginaActiva: 'Editar usuario',
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
    path: 'usuarios/crear',
    component: CrearUsuarioComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: {
      paginaActiva: 'Crear usuario',
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
    path: 'perfil',
    canActivate: [VerificaTokenGuard],
    component: PerfilComponent,
    data: {
      paginaActiva: 'Perfil de usuario',
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
      paginaActiva: 'Buscar',
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
