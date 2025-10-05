import { Route, Routes } from '@angular/router';
import { CrearConjuntoComponent } from './crearConjunto/crearConjunto.component';

export const ConjuntoRoutes: Routes = [
    {
        path:'',
        children: [
            {
                path: 'conjunto',
                component: CrearConjuntoComponent,
            },
        ]
    }
]