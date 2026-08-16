import AuthBootstrap from './components/auth/AuthBootstrap';
import PwaReloadPrompt from './components/pwa/PwaReloadPrompt';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <AuthBootstrap>
      <AppRoutes />
      <PwaReloadPrompt />
    </AuthBootstrap>
  );
};

export default App;
