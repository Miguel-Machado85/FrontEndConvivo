import { Routes } from "@angular/router";
import { roleGuard } from "src/app/guards/role.guard";
import { MenuVecinoComponent } from "./menuVecino/menuVecino.component";
import { MenuAdminComponent } from "./menuAdmin/menuAdmin.component";

export const MenuRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'vecino',
                component: MenuVecinoComponent,
                canActivate: [roleGuard],
                data: { role: 'vecino' }
            },
            {
                path: 'admin',
                component: MenuAdminComponent,
                canActivate: [roleGuard],
                data: { role: 'administrador' }
            }
        ]
    }
];