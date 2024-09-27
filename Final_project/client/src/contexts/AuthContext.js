import { createContext, useContext, useEffect, useState } from 'react';

// Tạo AuthoContext để chia sẻ dữ liệu xác thực
const AuthoContext = createContext();

const initializeUsers = () => {
  const storeUser = JSON.parse(localStorage.getItem('users'));
  return storeUser ? storeUser : [{ id: 1, username: 'admin', password: 'admin' }];
};

const initializeAuthState = () => {
  const storeISAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
  const storeIsAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const storeUserName = localStorage.getItem('username');

  return {
    isAuthenticated: storeISAuthenticated || false,
    isAdmin: storeIsAdmin || false,
    username: storeUserName || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initializeAuthState().isAuthenticated);
  const [isAdmin, setIsAdmin] = useState(initializeAuthState().isAdmin);
  const [username, setUsername] = useState(initializeAuthState().username);
  const [users, setUsers] = useState(initializeUsers());

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  const login = ({ username, password }) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setUsername(username);
      setIsAuthenticated(true);
      setIsAdmin(username === 'admin');
      return true;
    } else {
      return false;
    }
  };

  const register = ({ username, password }) => {
    const newUser = { id: users.length + 1, username, password };
    setUsers([...users, newUser]);
    setIsAuthenticated(true);
    setIsAdmin(username === 'admin');
  };

  const logout = () => {
    setUsername('');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthoContext.Provider
      value={{ isAuthenticated, isAdmin, username, login, register, logout, users }}
    >
      {children}
    </AuthoContext.Provider>
  );
};

export const useAuth = () => useContext(AuthoContext);
