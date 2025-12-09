import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export function useAuth() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) return null;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/users/${userId}`);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err.message || 'Failed to fetch user profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load currentUserId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const parsedId = parseInt(storedUserId, 10);
      setCurrentUserId(parsedId);
      // Fetch user profile for the stored ID
      fetchUserProfile(parsedId);
    }
  }, [fetchUserProfile]);

  // Login function - Select a user by ID
  const selectUser = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user profile to verify user exists
      const response = await apiClient.get(`/users/${userId}`);
      
      // Set state
      setCurrentUserId(userId);
      setUser(response.data);
      
      // Persist to localStorage
      localStorage.setItem('currentUserId', userId.toString());

      return response.data;
    } catch (err) {
      console.error('Failed to select user:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to select user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function - Clear currentUserId
  const logout = useCallback(() => {
    setCurrentUserId(null);
    setUser(null);
    localStorage.removeItem('currentUserId');
  }, []);

  return {
    currentUserId,
    user,
    isLoading,
    error,
    selectUser,
    logout,
    fetchUserProfile,
    isAuthenticated: currentUserId !== null,
  };
}

