export interface NavItemAdmin {
  displayName?: string;
  divider?: boolean;
  iconName?: string;
  navCap?: string;
  route?: string;
  children?: NavItemAdmin[];
  chip?: boolean;
  chipContent?: string;
  chipClass?: string;
  external?: boolean;
  subItemIcon?: boolean;
}
