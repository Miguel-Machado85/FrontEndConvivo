import { Routes } from '@angular/router';
import { AnunciosComponent } from './anuncios-vecinos/anuncios.component';
import { AnunciosAdminComponent } from './anuncios-admin/anuncios-admin.component';
import { CrearAnuncioComponent } from './crear-anuncio/crear-anuncio.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { roleGuard } from 'src/app/guards/role.guard';

export const AnunciosRoutes: Routes = [
  {
    path: '',
    component: AnunciosComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'vecino' }
  },
  {
    path: 'admin',
    component: AnunciosAdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' }
  },
  {
    path: 'crear',
    component: CrearAnuncioComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' }
  },
];
