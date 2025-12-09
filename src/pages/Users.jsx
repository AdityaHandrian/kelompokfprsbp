import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import { User, ShoppingBag, Loader, AlertCircle, LogOut, CheckCircle } from 'lucide-react';

// User Card Component for UserList
function UserCard({ user, isSelected, onSelect, userId }) {
  return (
    <div
      onClick={() => onSelect(userId)}
      className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.user_name || `User #${userId}`}</h3>
          <p className="text-sm text-gray-500">
            {user.num_purchases || user.total_purchases || 0} purchases
          </p>
        </div>
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-blue-500" />
        )}
      </div>
    </div>
  );
}

// User List Component
function UserList({ users, currentUserId, onSelectUser, isLoading, page }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((user, index) => {
        // Calculate userId from page and index (assuming users are returned in order)
        const userId = user.userId || ((page - 1) * users.length + index + 1);
        return (
          <UserCard
            key={userId}
            user={user}
            userId={userId}
            isSelected={currentUserId === userId}
            onSelect={onSelectUser}
          />
        );
      })}
    </div>
  );
}

// User Profile Component
function UserProfile({ user, userId, onLogout }) {
  if (!user) return null;

  const purchaseHistory = user.purchase_history_details || [];
  const displayName = user.user_name || `User #${userId}`;
  const totalPurchases = user.num_purchases || user.total_purchases || purchaseHistory.length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-500">User #{userId} • Currently selected</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Switch User
        </button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">User ID</p>
          <p className="text-xl font-bold text-gray-900">{userId}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-xl font-bold text-gray-900">{totalPurchases}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Avg Rating</p>
          <p className="text-xl font-bold text-gray-900">{user.avg_rating?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Favorite Category</p>
          <p className="text-sm font-medium text-gray-900 truncate">{user.favorite_category || 'N/A'}</p>
        </div>
      </div>

      {/* Purchase History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Purchase History
        </h3>
        {purchaseHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {purchaseHistory.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || `Item ${item.itemId}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name || `Item #${item.itemId}`}
                  </p>
                  <p className="text-xs text-gray-500">ID: {item.itemId}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No purchase history available</p>
        )}
      </div>
    </div>
  );
}

// Main Users Page
export default function Users() {
  const { currentUserId, user, selectUser, logout, isLoading: authLoading, error: authError } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch all users on mount
  useEffect(() => {
    async function fetchUsers() {
      setIsLoadingUsers(true);
      setError(null);
      try {
        const response = await apiClient.get('/users/', {
          params: { page, limit: 50 }
        });
        setUsers(response.data.users || response.data);
        setTotal(response.data.total || response.data.users?.length || response.data.length || 0);
        setTotalPages(response.data.total_pages || 1);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to fetch users');
      } finally {
        setIsLoadingUsers(false);
      }
    }
    fetchUsers();
  }, [page]);

  const handleSelectUser = async (userId) => {
    try {
      await selectUser(userId);
    } catch (err) {
      console.error('Failed to select user:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentUserId ? 'User Profile' : 'Select a User'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {currentUserId
            ? 'View your profile and purchase history, or switch to a different user.'
            : 'Select a user from the list below to simulate being logged in and receive personalized recommendations.'}
        </p>
      </div>

      {/* Error Message */}
      {(error || authError) && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error || authError}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Profile (when logged in) */}
      {currentUserId && user && (
        <UserProfile user={user} userId={currentUserId} onLogout={logout} />
      )}

      {/* Loading state for auth */}
      {authLoading && (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      )}

      {/* User List Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentUserId ? 'Switch to Another User' : 'Available Users'}
          </h2>
          {total > 0 && (
            <span className="text-sm text-gray-500">
              Showing {users.length} of {total} users
            </span>
          )}
        </div>
        <UserList
          users={users}
          currentUserId={currentUserId}
          onSelectUser={handleSelectUser}
          isLoading={isLoadingUsers}
          page={page}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
