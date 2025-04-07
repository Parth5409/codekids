import { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState('light');
  const [progress, setProgress] = useState({
    level: 1,
    badges: [],
    completedChallenges: [],
    points: 0
  });

  const login = async (userData) => {
    // Here you would typically make an API call
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
  };

  const updateProgress = (newProgress) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        theme, 
        progress, 
        setTheme, 
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