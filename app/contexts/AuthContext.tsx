// app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  name: string;
  profilePicture?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Loaded user data from localStorage:", parsedUser);
      if (!parsedUser.profilePicture) {
        console.warn("Loaded user data does not contain profilePicture");
      }
      setUser(parsedUser);
    } else {
      console.log("No user data found in localStorage");
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    console.log("Logging in user:", userData);
    if (!userData.profilePicture) {
      console.warn("User data does not contain profilePicture");
    }
    const userToStore = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      profilePicture: userData.profilePicture,
      bio: userData.bio
    };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    console.log("User data stored in localStorage:", JSON.parse(localStorage.getItem('user') || '{}'));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const updateUser = (updates: Partial<User>) => {
    console.log("Updating user with:", updates);
    setUser(currentUser => {
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        console.log("Updated user data:", updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
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