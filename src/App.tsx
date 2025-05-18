import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" toastOptions={{
        className: 'text-sm font-medium',
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      }} />
    </>
  );
};

export default App;
