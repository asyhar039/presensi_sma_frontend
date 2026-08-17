import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useLoginUserMutation } from '../services/authAPI';
import { getErrorMessage } from '../../../utils/errors';
import { ROUTES } from '../../../constants/routes';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleLogin = async (credentials) => {
    try {
      const res = await loginUser(credentials).unwrap();
      if (res?.status === 'success') {
        navigate(ROUTES.DASHBOARD, { replace: true });
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
