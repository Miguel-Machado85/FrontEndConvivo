import { Routes } from '@angular/router';
import { VerComentariosComponent } from './ver-comentarios/ver-comentarios.component';

export const ComentariosRoutes: Routes = [
  {
    path: 'ver-comentarios',
    component: VerComentariosComponent,
  },
  // Future: { path: 'crear-comentarios', component: CrearComentariosComponent }
];
