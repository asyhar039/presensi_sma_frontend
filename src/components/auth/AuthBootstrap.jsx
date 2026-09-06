import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '../../features/auth/services/authAPI';
import { useDispatch } from 'react-redux';
import { logout, sessionUnavailable, sessionVerified, setLoading } from '../../features/auth/authSlice';
import { useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Loading from '../feedback/Loading/Loading';

/**
 * Session bootstrap guard.
 *
 * Role flow:
 *   Super Admin / Admin / Guru -> me.php confirms `data.user`  -> NOT student -> skip student profile
 *   Siswa                     -> me.php has no `data.user`      -> student    -> fetch student profile
 *
 * The student profile endpoint (`/student/profile.php`) is the auth restore path
 * for the `student` role, so it must only run when me.php did NOT confirm a user session.
 *
 * When the backend is unreachable (e.g. maintenance), the auth restore queries
 * resolve with an error instead of hanging, and the app proceeds to render so the
 * user sees the (unauthenticated) UI with a friendly error state.
 */
const AuthBootstrap = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoginPage = location.pathname === ROUTES.LOGIN;

  const hasToken = Boolean(localStorage.getItem('token'));
  const storedUser = localStorage.getItem('user');
  const isValidSession = hasToken && storedUser;

  const { data: userResponse, isLoading: loadingUser, error: userError, isFetching: fetchingUser } = useGetCurrentUserQuery(undefined, {
    skip: isLoginPage || !hasToken,
  });

  const currentUser = userResponse?.data?.user || userResponse?.data;
  const sessionConfirmed = Boolean(
    currentUser?.id && (Array.isArray(currentUser.roles) || currentUser.role)
  );

  useEffect(() => {
    dispatch(setLoading(fetchingUser));
  }, [fetchingUser, dispatch]);

  useEffect(() => {
    if (sessionConfirmed) dispatch(sessionVerified());
    if (userError?.status === 401 || userError?.status === 403) dispatch(logout());
    else if (userError) dispatch(sessionUnavailable());
  }, [sessionConfirmed, userError, dispatch]);

  if (!isLoginPage && userError && userError.status !== 401 && userError.status !== 403) {
    return (
      <div className="flex min-h-dvh min-h-screen w-full items-center justify-center p-4">
        <Loading message="Sesi belum dapat diverifikasi. Silakan coba lagi." />
      </div>
    );
  }

  if (!isLoginPage && (loadingUser || fetchingUser)) {
    return (
      <div className="flex min-h-dvh min-h-screen w-full items-center justify-center p-4">
        <Loading message="Memuat aplikasi React..." />
      </div>
    );
  }

  if (!isValidSession && !isLoginPage) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default AuthBootstrap;