import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]); // List of logged-in accounts
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference for dark mode
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load user and accounts from storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    
    if (storedUser) {
      setUser(storedUser);
    }
    setAccounts(storedAccounts);
    setLoading(false);
  }, []);

  const switchAccount = (email) => {
    const targetAccount = accounts.find(acc => acc.email === email);
    if (targetAccount) {
      setUser(targetAccount);
      localStorage.setItem('user', JSON.stringify(targetAccount));
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newVal;
    });
  };

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    
    // Add to accounts list
    setAccounts(prev => {
      const exists = prev.find(acc => acc.email === data.email);
      if (exists) return prev;
      const newAccounts = [...prev, data];
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });
    
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await authAPI.signup({ name, email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));

    // Add to accounts list
    setAccounts(prev => {
      const exists = prev.find(acc => acc.email === data.email);
      if (exists) return prev;
      const newAccounts = [...prev, data];
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });

    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const removeAccount = (email) => {
    setAccounts(prev => {
      const newAccounts = prev.filter(acc => acc.email !== email);
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      if (user?.email === email) {
        logout();
      }
      return newAccounts;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accounts,
      switchAccount,
      removeAccount,
      chats, 
      setChats,
      selectedChat, 
      setSelectedChat, 
      login, 
      signup,
      logout,
      loading,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
