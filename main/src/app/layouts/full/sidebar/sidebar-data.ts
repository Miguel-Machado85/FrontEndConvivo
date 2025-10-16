import { NavItem } from './nav-item/nav-item';

export const navItemsAdmin: NavItem[] = [
  { navCap: 'Administración' },
  { displayName: 'Usuarios', iconName: 'solar:user-line-duotone', route: '/admin-dashboard/usuarios' },
  { displayName: 'Reportes', iconName: 'solar:chart-line-duotone', route: '/admin-dashboard/reportes' },
];

export const navItemsVecino: NavItem[] = [
  { navCap: 'Inicio' },
  { displayName: 'Mi Perfil', iconName: 'solar:user-line-duotone', route: '/vecino-dashboard/perfil' },
  { displayName: 'Noticias', iconName: 'solar:newspaper-line-duotone', route: '/vecino-dashboard/noticias' },
];

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Ui Components',
    divider: true
  },
  {
    displayName: 'Badge',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'solar:danger-circle-line-duotone',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'solar:bookmark-square-minimalistic-line-duotone',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'solar:text-field-focus-line-duotone',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/tables',
  },
  {
    navCap: 'Extra',
    divider: true
  },
  {
    displayName: 'Icons',
    iconName: 'solar:sticker-smile-circle-2-line-duotone',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/sample-page',
  },
  
];
