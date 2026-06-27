import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('procurehub_token');
    const savedUser = localStorage.getItem('procurehub_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('procurehub_token');
        localStorage.removeItem('procurehub_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('procurehub_token', newToken);
    localStorage.setItem('procurehub_user', JSON.stringify(userData));

    // Role-based redirect
    if (userData.role === 'procurement_manager') {
      navigate('/dashboard');
    } else {
      navigate('/marketplace');
    }

    return response.data;
  };

  // Signup function
  const signup = async (email, password, company_name, role) => {
    const response = await axiosClient.post('/auth/signup', {
      email,
      password,
      company_name,
      role,
    });
    const { token: newToken, user: userData } = response.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('procurehub_token', newToken);
    localStorage.setItem('procurehub_user', JSON.stringify(userData));

    // Role-based redirect
    if (userData.role === 'procurement_manager') {
      navigate('/dashboard');
    } else {
      navigate('/marketplace');
    }

    return response.data;
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('procurehub_token');
    localStorage.removeItem('procurehub_user');
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isManager: user?.role === 'procurement_manager',
    isVendor: user?.role === 'vendor',
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
