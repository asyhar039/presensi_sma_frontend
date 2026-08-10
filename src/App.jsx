import { useGetCurrentUserQuery } from './features/auth/services/authAPI';
import { useGetStudentProfileQuery } from './features/students/services/studentsAPI';
import { Loading } from './components/common/Loading/Loading';
import AppRoutes from './routes/AppRoutes';

function AuthBootstrap({ children }) {
  const { data: userResponse, isLoading: loadingUser } = useGetCurrentUserQuery();
  const isUserSessionActive = userResponse?.status === 'success' && userResponse?.data?.user;
  const { isLoading: loadingStudent } = useGetStudentProfileQuery(undefined, {
    skip: isUserSessionActive,
  });

  if (loadingUser || loadingStudent) {
    return <Loading message="Memuat aplikasi React..." />;
  }

  return children;
}

export default function App() {
  return (
    <AuthBootstrap>
      <AppRoutes />
    </AuthBootstrap>
  );
}
