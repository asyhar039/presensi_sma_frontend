import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useLoginUserMutation } from '../services/authAPI';
import { getErrorMessage } from '../../../utils/errors';
import { ROUTES } from '../../../constants/routes';
import { ROLES } from '../../../constants/roles';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleLogin = async (credentials) => {
    try {
      const res = await loginUser(credentials).unwrap();
      if (res?.token || res?.status === 'success') {
        const loggedInUser = res?.user || res?.data?.user || res?.data?.student;
        const roles = Array.isArray(loggedInUser?.roles)
          ? loggedInUser.roles
          : loggedInUser?.role
            ? [loggedInUser.role]
            : [];
        const isStudent = roles.includes('Siswa') || roles.includes(ROLES.STUDENT);
        navigate(isStudent ? ROUTES.PROFILE : ROUTES.DASHBOARD, { replace: true });
      }
    } catch {
      // Error handling is managed by the error state from RTK Query
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={isLoading}
      errorMessage={error ? getErrorMessage(error) : ''}
    />
  );
};

export default LoginScreen;
