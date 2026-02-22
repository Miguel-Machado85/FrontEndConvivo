import { Routes } from '@angular/router';
import { VerVecinosComponent } from './ver-vecinos/ver-vecinos.component';

export const VecinosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ver-vecinos',
        component: VerVecinosComponent,
      },
    ],
  },
];
