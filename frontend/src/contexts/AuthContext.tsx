import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      // Simulate API response
      const fakeResponse = {
        user: { email, name: 'Test User' },
        token: 'mock-token'
      };
      setUser(fakeResponse.user);
      localStorage.setItem('user', JSON.stringify(fakeResponse.user));
      localStorage.setItem('authToken', fakeResponse.token);
      console.log('Login successful, user set');
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ username, email, password }: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const fakeResponse = {
        user: { username, email },
        token: 'mock-token'
      };
      setUser(fakeResponse.user);
      localStorage.setItem('user', JSON.stringify(fakeResponse.user));
      localStorage.setItem('authToken', fakeResponse.token);
      console.log('Signup successful, user set');
      navigate('/');
    } catch (error) {
      console.error('Signup failed', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  useEffect(() => {
    console.log('Auth initialized. Current user:', user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
