import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';

export const PAGOS_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./pagosAdmin/pagosAdmin.component').then(m => m.PagosAdminComponent),
    canActivate: [roleGuard],
    data: { role: 'administrador' }
  },
  {
    path: 'crear',
    loadComponent: () => import('./crearPago/crearPago.component').then(m => m.CrearPagoComponent),
    canActivate: [roleGuard],
    data: { role: 'administrador' }
  },
  {
    path: 'detalle/:pagoId',
    loadComponent: () => import('./detallePago/detallePago.component').then(m => m.DetallePagoComponent),
    canActivate: [roleGuard],
    data: { role: 'administrador' }
  }
];
