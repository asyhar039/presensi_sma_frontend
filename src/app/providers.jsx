import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import ToastProvider from '../components/feedback/Toast/toastContext';

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>{children}</ToastProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default AppProviders;