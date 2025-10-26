import { Routes } from "@angular/router";
import { roleGuard } from "src/app/guards/role.guard";
import { PerfilAdminComponent } from "./perfilAdmin/perfilAdmin.component";
import { PerfilVecinoComponent } from "./perfilVecino/perfilVecino.component";
import { EditAdminComponent } from "./edit-admin/edit-admin.component";
import { EditVecinoComponent } from "./edit-vecino/edit-vecino.component";

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
            },
            {
                path: 'editAdmin/:id',
                component: EditAdminComponent,
                canActivate: [roleGuard],
                data: { role: 'administrador' }
            },
            {
                path: 'editVecino/:id',
                component: EditVecinoComponent,
                canActivate: [roleGuard],
                data: { role: 'vecino' }
            }
        ]
    }
];