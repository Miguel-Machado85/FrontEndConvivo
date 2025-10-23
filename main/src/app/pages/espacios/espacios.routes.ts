import { Routes } from "@angular/router";
import { roleGuard } from "src/app/guards/role.guard";
import { EspaciosAdminComponent } from "./espaciosAdmin/espaciosAdmin.component";
import { CrearEspacioComponent } from "./crearEspacio/crearEspacio.component";
import { EspaciosVecinoComponent } from "./espaciosVecino/espaciosVecino.component";

export const EspaciosRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: EspaciosAdminComponent,
                canActivate: [roleGuard],
                data: { role: 'administrador' }
            },
            {
                path: 'crear',
                component: CrearEspacioComponent,
                canActivate: [roleGuard],
                data: { role: 'administrador' }
            },
            {
                path: 'reservar',
                component: EspaciosVecinoComponent,
                canActivate: [roleGuard],
                data: { role: 'vecino' }
            }
        ]
    }
];