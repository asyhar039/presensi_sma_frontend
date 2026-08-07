import { useAppSelector } from '../../app/hooks';
import { selectUserPermissions } from '../../features/auth/authSelectors';

export function PermissionGuard({ permission, children, fallback = null }) {
  const permissions = useAppSelector(selectUserPermissions);
  
  if (!permissions.includes(permission)) {
    return fallback;
  }
  
  return children;
}

export function AnyPermissionGuard({ permissions: requiredPermissions, children, fallback = null }) {
  const userPermissions = useAppSelector(selectUserPermissions);
  
  if (!requiredPermissions.some(perm => userPermissions.includes(perm))) {
    return fallback;
  }
  
  return children;
}

export function AllPermissionsGuard({ permissions: requiredPermissions, children, fallback = null }) {
  const userPermissions = useAppSelector(selectUserPermissions);
  
  if (!requiredPermissions.every(perm => userPermissions.includes(perm))) {
    return fallback;
  }
  
  return children;
}
