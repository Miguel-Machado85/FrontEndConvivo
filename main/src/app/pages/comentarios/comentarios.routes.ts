import { Routes } from '@angular/router';
import { VerComentariosComponent } from './ver-comentarios/ver-comentarios.component';
import { CrearComentariosComponent } from './crear-comentarios/crear-comentarios.component';

export const ComentariosRoutes: Routes = [
  {
    path: 'ver-comentarios',
    component: VerComentariosComponent,
  },
  {
    path: 'crear-comentarios',
    component: CrearComentariosComponent,
  },
];
