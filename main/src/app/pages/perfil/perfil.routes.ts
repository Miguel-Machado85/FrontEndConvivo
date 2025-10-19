import { Routes } from "@angular/router";
import { roleGuard } from "src/app/guards/role.guard";
import { PerfilAdminComponent } from "./perfilAdmin/perfilAdmin.component";
import { PerfilVecinoComponent } from "./perfilVecino/perfilVecino.component";

export const PerfilRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'admin',
                component: PerfilAdminComponent,
                canActivate: [roleGuard],
                data: { role: 'administrador' }
            },
            {
                path: 'vecino',
                component: PerfilVecinoComponent,
                canActivate: [roleGuard],
                data: { role: 'vecino' }
            }
        ]
    }
];