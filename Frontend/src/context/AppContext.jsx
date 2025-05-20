import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [theme, setTheme] = useState('light');
  const [progress, setProgress] = useState({
    level: 1,
    badges: [],
    completedChallenges: [],
    points: 0
  });

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
      console.log('Login response:', response.data);
      
      const { token, id, username, email, avatar, points, country, role } = response.data;
      
      const userData = {
        id,
        username,
        email,
        avatar,
        points,
        country,
        role
      };
      
      setUser(userData);
      setToken(token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { token, id, username, email, avatar, points, country, role } = response.data;
      
      const userData = { id, username, email, avatar, points, country, role };
      setUser(userData);
      setToken(token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProgress = (newProgress) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  // Set up axios interceptor for authentication
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        theme, 
        progress,
        token, 
        setTheme,
        signup,
        login,
        logout, 
        updateProgress 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};