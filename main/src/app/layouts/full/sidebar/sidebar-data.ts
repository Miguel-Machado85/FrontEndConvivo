import { NavItemAdmin } from './nav-item-admin/nav-item-admin';
import { NavItemVecino } from './nav-item-vecino/nav-item-vecino';
export const navItemsAdmin: NavItemAdmin[] = [
  { navCap: 'Administración' },
  { displayName: 'Menú', iconName: 'solar:widget-add-line-duotone',route: '/menu/admin'},
  { displayName: 'Mi Perfil', iconName: 'solar:user-line-duotone', route: '/perfil/admin' },
  { displayName: 'Espacios Comunes', iconName: 'teenyicons:pin-outline', route: '/espacios/list' },
  { displayName: 'Mis Vecinos', iconName: 'solar:users-group-two-rounded-line-duotone', route: '/vecinos/ver-vecinos' },
  { displayName: 'Anuncios del conjunto', iconName: 'ri:news-line', route: '/anuncios/admin' },
  { displayName: 'Reportes', iconName: 'solar:chart-line-duotone', route: '/admin-dashboard/reportes' },
];

export const navItemsVecino: NavItemVecino[] = [
  { navCap: 'Vecino' },
  { displayName: 'Menú', iconName: 'solar:widget-add-line-duotone',route: '/menu/vecino'},
  { displayName: 'Reservar Espacio', iconName: 'solar:calendar-minimalistic-linear', route: '/espacios/reservar' },
  { displayName: 'Gestionar Reservas', iconName: 'solar:calendar-search-linear', route: '/espacios/gestionar-reserva' },
  { displayName: 'Comentarios', iconName: 'solar:chat-line-linear', route: '/comentarios/ver-comentarios' },
  { displayName: 'Anuncios del conjunto', iconName: 'ri:news-line', route: '/anuncios' },
  { displayName: 'Mi Perfil', iconName: 'solar:user-line-duotone', route: '/perfil/vecino' },
  
];

