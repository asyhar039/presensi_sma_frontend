import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '../../features/auth/services/authAPI';
import { useGetStudentProfileQuery } from '../../features/students/services/studentsAPI';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../features/auth/authSlice';
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

  const isConfirmedNonStudent =
    userResponse?.status === 'success' && userResponse?.data?.user;
  const backendUnreachable = Boolean(userError);

  const { isLoading: loadingStudent, isFetching: fetchingStudent } = useGetStudentProfileQuery(undefined, {
    skip: isLoginPage || isConfirmedNonStudent || (!hasToken && !storedUser) || backendUnreachable,
  });

  useEffect(() => {
    dispatch(setLoading(fetchingUser || fetchingStudent));
  }, [fetchingUser, fetchingStudent, dispatch]);

  useEffect(() => {
    if (userError?.status === 401 || userError?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(setLoading(false));
    }
  }, [userError, dispatch]);

  if (!isLoginPage && (loadingUser || loadingStudent || fetchingUser || fetchingStudent)) {
    return (
      <div className="flex min-h-dvh min-h-screen w-full items-center justify-center p-4">
        <Loading message="Memuat aplikasi React..." />
      </div>
    );
  }

  if (!isValidSession) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default AuthBootstrap;