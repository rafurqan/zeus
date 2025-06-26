import { User } from '@/core/types/user';
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Konteks untuk AppContext
interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  loading: true,
  setLoading: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient(); // React Query client

export default function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    }
  }, [user, token]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{ user, setUser, token, setToken, loading, setLoading }}
      >
        {children}
      </AppContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
