export function canCreate(permissions: string[], resource: string): boolean {
  return permissions.includes(`${resource}:create`) || permissions.includes('*')
}
export function canEdit(permissions: string[], resource: string): boolean {
  return permissions.includes(`${resource}:edit`) || permissions.includes('*')
}
export function canDelete(permissions: string[], resource: string): boolean {
  return permissions.includes(`${resource}:delete`) || permissions.includes('*')
}
export function canView(permissions: string[], resource: string): boolean {
  return permissions.includes(`${resource}:view`) || permissions.includes('*')
}
