import React from "react";
import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setError(null);
      const response = await registerUser({ username, email, password });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create account";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setError(null);
  };

  // Update the updateUser function
  const updateUser = async (userData) => {
    try {
      const response = await updateUserProfile(userData);
      setCurrentUser(prev => ({ ...prev, ...userData }));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}