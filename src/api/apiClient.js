import axios from 'axios';

// Base URL untuk backend (akan diganti sesuai deployment)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for ML model inference
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;

// API Helper Functions

/**
 * Get all users
 * @returns {Promise} - List of users
 */
export const getUsers = () => apiClient.get('/users/');

/**
 * Get user profile by ID
 * @param {number} userId - User ID
 * @returns {Promise} - User profile with purchase history
 */
export const getUserProfile = (userId) => apiClient.get(`/users/${userId}`);

/**
 * Get paginated products
 * @param {number} pageNum - Page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - List of products
 */
export const getProducts = (pageNum, pageSize) => 
  apiClient.get(`/products/${pageNum}/page/${pageSize}`);

/**
 * Get product details by ID
 * @param {number} itemId - Item ID
 * @returns {Promise} - Product details
 */
export const getProductDetails = (itemId) => apiClient.get(`/products/${itemId}`);

/**
 * Get KNN recommendations for a user
 * @param {number} userId - User ID
 * @returns {Promise} - KNN recommendations
 */
export const getKnnRecommendations = (userId) => 
  apiClient.get(`/recommend_knn/${userId}`);

/**
 * Get SVD++ recommendations for a user
 * @param {number} userId - User ID
 * @returns {Promise} - SVD++ recommendations
 */
export const getSvdppRecommendations = (userId) => 
  apiClient.get(`/recommend_svdpp/${userId}`);

/**
 * Get NCF recommendations for a user
 * @param {number} userId - User ID
 * @returns {Promise} - NCF recommendations
 */
export const getNcfRecommendations = (userId) => 
  apiClient.get(`/recommend_ncf/${userId}`);

/**
 * Get CBF recommendations for a user
 * @param {number} userId - User ID
 * @returns {Promise} - CBF recommendations
 */
export const getCbfRecommendations = (userId) => 
  apiClient.get(`/recommend_cbf/${userId}`);

/**
 * Get KNN context recommendations for a user and item
 * @param {number} userId - User ID
 * @param {number} itemId - Item ID
 * @returns {Promise} - KNN context recommendations
 */
export const getKnnContextRecommendations = (userId, itemId) => 
  apiClient.get(`/recommend_knn/${userId}/context/${itemId}`);

/**
 * Get SVD++ context recommendations for a user and item
 * @param {number} userId - User ID
 * @param {number} itemId - Item ID
 * @returns {Promise} - SVD++ context recommendations
 */
export const getSvdppContextRecommendations = (userId, itemId) => 
  apiClient.get(`/recommend_svdpp/${userId}/context/${itemId}`);

/**
 * Get NCF context recommendations for a user and item
 * @param {number} userId - User ID
 * @param {number} itemId - Item ID
 * @returns {Promise} - NCF context recommendations
 */
export const getNcfContextRecommendations = (userId, itemId) => 
  apiClient.get(`/recommend_ncf/${userId}/context/${itemId}`);

/**
 * Get CBF context recommendations for a user and item
 * @param {number} userId - User ID
 * @param {number} itemId - Item ID
 * @returns {Promise} - CBF context recommendations
 */
export const getCbfContextRecommendations = (userId, itemId) => 
  apiClient.get(`/recommend_cbf/${userId}/context/${itemId}`);
