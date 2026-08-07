export function hasPermission(permissions, permission) {
  return Array.isArray(permissions) && permissions.includes(permission);
}

export function hasAnyPermission(permissions, requiredPermissions) {
  if (!Array.isArray(permissions) || !Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.some((perm) => permissions.includes(perm));
}

export function hasAllPermissions(permissions, requiredPermissions) {
  if (!Array.isArray(permissions) || !Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.every((perm) => permissions.includes(perm));
}

export function canCreate(permissions, resource) {
  return hasPermission(permissions, `${resource}.create`);
}

export function canEdit(permissions, resource) {
  return hasPermission(permissions, `${resource}.edit`);
}

export function canDelete(permissions, resource) {
  return hasPermission(permissions, `${resource}.delete`);
}

export function canView(permissions, resource) {
  return hasPermission(permissions, `${resource}.view`);
}
