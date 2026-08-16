import { useGetCurrentUserQuery } from '../../features/auth/services/authAPI';
import { useGetStudentProfileQuery } from '../../features/students/services/studentsAPI';
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
 */
const AuthBootstrap = ({ children }) => {
  const { data: userResponse, isLoading: loadingUser } = useGetCurrentUserQuery();
  const isConfirmedNonStudent =
    userResponse?.status === 'success' && userResponse?.data?.user;
  const { isLoading: loadingStudent } = useGetStudentProfileQuery(undefined, {
    skip: isConfirmedNonStudent,
  });

  if (loadingUser || loadingStudent) {
    return <Loading message="Memuat aplikasi React..." />;
  }

  return children;
};

export default AuthBootstrap;
