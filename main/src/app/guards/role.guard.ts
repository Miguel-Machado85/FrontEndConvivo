import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem("AuthToken");
    const rol = localStorage.getItem("rol");
    const expectedRole = route.data['role'];

    if (token && rol === expectedRole) {
        return true;
    } else {
        router.navigate(['authentication/login']);
        return false;
    }
};