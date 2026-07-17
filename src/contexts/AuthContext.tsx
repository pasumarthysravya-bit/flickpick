import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('flickpick_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('flickpick_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    // For mock purposes, we just accept any valid-looking credentials
    // But we check if the user exists in our "mock database" (localStorage)
    const storedUsersStr = localStorage.getItem('flickpick_users_db');
    const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    
    const foundUser = storedUsers.find((u: any) => u.email === credentials.email && u.password === credentials.password);
    
    if (foundUser) {
      const loggedInUser = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(loggedInUser);
      localStorage.setItem('flickpick_user', JSON.stringify(loggedInUser));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    // Mock register delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const storedUsersStr = localStorage.getItem('flickpick_users_db');
    const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    
    if (storedUsers.some((u: any) => u.email === credentials.email)) {
      throw new Error('User already exists with this email');
    }
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.name,
      password: credentials.password // Do not store plaintext in real app
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('flickpick_users_db', JSON.stringify(storedUsers));
    
    const loggedInUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(loggedInUser);
    localStorage.setItem('flickpick_user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flickpick_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
