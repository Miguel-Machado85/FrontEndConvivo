import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: 'menu-admin',
    component: FullComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/menu/menu.routes').then((m) => m.MenuRoutes)
      }
    ]
  },
  {
    path: 'menu-vecino',
    component: FullComponent,
    children: [
      {
        path: 'vecino',
        loadChildren: () =>
          import('./pages/menu/menu.routes').then((m) => m.MenuRoutes)
      }
    ]
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./pages/menu/menu.routes').then((m) => m.MenuRoutes),
      }
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
