import { useGetCurrentUserQuery } from './features/auth/services/authAPI';
import { useGetStudentProfileQuery } from './features/students/services/studentsAPI';
import Loading from './components/feedback/Loading/Loading';
import PwaReloadPrompt from './components/pwa/PwaReloadPrompt';
import AppRoutes from './routes/AppRoutes';

const AuthBootstrap = ({ children }) => {
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

const App = () => {
  return (
    <AuthBootstrap>
      <AppRoutes />
      <PwaReloadPrompt />
    </AuthBootstrap>
  );
};

export default App;

