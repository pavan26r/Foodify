import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [foodPartner, setFoodPartner] = useState(null);

  useEffect(() => {
    // Check if user is already logged in by verifying session
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://foodify-ehzi.onrender.com/api/auth/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setFoodPartner(response.data);
      } catch (error) {
        setIsAuthenticated(false);
        setFoodPartner(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (partnerData) => {
    setIsAuthenticated(true);
    setFoodPartner(partnerData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setFoodPartner(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, foodPartner, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
