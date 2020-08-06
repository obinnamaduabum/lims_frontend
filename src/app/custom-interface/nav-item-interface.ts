export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName?: string;
  route?: string;
  showDivider?: boolean;
  activeLinkOptions?: boolean;
  rolesAllowedToView?: any[];
  children?: NavItem[];
}
