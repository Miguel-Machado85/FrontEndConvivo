import { NavItemAdmin } from './nav-item-admin/nav-item-admin';
import { NavItemVecino } from './nav-item-vecino/nav-item-vecino';
export const navItemsAdmin: NavItemAdmin[] = [
  { navCap: 'Administración' },
  { displayName: 'Dashboard', iconName: 'solar:widget-add-line-duotone',route: '/menu/admin'},
  { displayName: 'Usuarios', iconName: 'solar:user-line-duotone', route: '/admin-dashboard/usuarios' },
  { displayName: 'Reportes', iconName: 'solar:chart-line-duotone', route: '/admin-dashboard/reportes' },
];

export const navItemsVecino: NavItemVecino[] = [
  { navCap: 'Vecino' },
  { displayName: 'Dashboard', iconName: 'solar:widget-add-line-duotone',route: '/menu/vecino'},
  { displayName: 'Mi Perfil', iconName: 'solar:user-line-duotone', route: '/vecino-dashboard/perfil' },
  { displayName: 'Noticias', iconName: 'solar:user-line-duotone', route: '/vecino-dashboard/noticias' },
];

