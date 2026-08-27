import { useAppSelector } from '../app/hooks';
import {
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  selectUserPermissions,
  selectAuth,
} from '../features/auth/authSelectors';
import { useLogoutMutation } from '../features/auth/services/authAPI';

export function useAuth() {
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const permissions = useAppSelector(selectUserPermissions);
  const [logout] = useLogoutMutation();

  return { 
    user, 
    isAuthenticated, 
    role, 
    permissions, 
    logout,
    loading: auth.loading 
  };
}
