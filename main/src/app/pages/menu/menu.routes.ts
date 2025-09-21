import { Routes } from "@angular/router";
import { authGuard } from "src/app/guards/auth.guard";
import { MenuVecinoComponent } from "./menuVecino/menuVecino.component";
import { MenuAdminComponent } from "./menuAdmin/menuAdmin.component";


export const MenuRoutes: Routes =[{
    path:'',
    children: [
        {
            path:'vecino',
            component: MenuVecinoComponent,
        },
        {
            path:'admin',
            component: MenuAdminComponent,
        }
    ], canActivate: [authGuard]
}]