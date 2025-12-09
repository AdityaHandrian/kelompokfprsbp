import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { ROUTES } from '../utils/constants';
import { 
  Loader, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Star,
  TrendingUp,
  Zap,
  Brain,
  Search,
  Filter,
  ShoppingBag
} from 'lucide-react';

// Algorithm Info
const ALGORITHMS = {
  knn: { 
    name: 'KNN', 
    fullName: 'K-Nearest Neighbors',
    description: 'Item-based collaborative filtering using cosine similarity',
    color: 'blue',
    icon: Search
  },
  svdpp: { 
    name: 'SVD++', 
    fullName: 'SVD++ (Latent Factor Model)',
    description: 'Matrix factorization with implicit feedback',
    color: 'purple',
    icon: TrendingUp
  },
  ncf: { 
    name: 'NCF', 
    fullName: 'Neural Collaborative Filtering',
    description: 'Deep learning-based recommendation model',
    color: 'green',
    icon: Brain
  },
  cbf: { 
    name: 'CBF', 
    fullName: 'Content-Based Filtering',
    description: 'Recommends based on item features and user preferences',
    color: 'orange',
    icon: Filter
  },
};

// Product Card Component
function CatalogProductCard({ product, onClick }) {
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name || `Item ${product.itemId}`}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name || `Item #${product.itemId}`}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{formatPrice(product.price)}</p>
        {product.match_percentage && (
          <div className="flex items-center mt-2 text-xs text-green-600">
            <Zap className="w-3 h-3 mr-1" />
            {product.match_percentage}
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton Loader for Recommendation Row
function RecommendationRowSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48">
            <div className="h-32 bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recommendation Row Component
function RecommendationRow({ algorithm, userId, onProductClick }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const algoInfo = ALGORITHMS[algorithm];
  const IconComponent = algoInfo.icon;

  useEffect(() => {
    async function fetchRecommendations() {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`/recommend_${algorithm}/${userId}`);
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error(`Failed to fetch ${algorithm} recommendations:`, err);
        setError(err.response?.data?.detail || err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecommendations();
  }, [algorithm, userId]);

  // Hide section if error
  if (error) {
    return null;
  }

  if (isLoading) {
    return <RecommendationRowSkeleton />;
  }

  if (recommendations.length === 0) {
    return null;
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${colorClasses[algoInfo.color]}`}>
          <IconComponent className="w-4 h-4 mr-2" />
          {algoInfo.name}
        </div>
        <span className="ml-3 text-sm text-gray-500">{algoInfo.fullName}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{algoInfo.description}</p>
      
      {/* Horizontal Scroll Container */}
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        {recommendations.map((product) => (
          <CatalogProductCard
            key={product.itemId}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}

// Context Modal Component
function ContextModal({ isOpen, onClose, product, userId }) {
  const [contextRecs, setContextRecs] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || !product || !userId) return;

    // Fetch context recommendations for all 4 algorithms
    const algorithms = ['knn', 'svdpp', 'ncf', 'cbf'];
    
    algorithms.forEach(async (algo) => {
      setIsLoading((prev) => ({ ...prev, [algo]: true }));
      setErrors((prev) => ({ ...prev, [algo]: null }));
      
      try {
        const response = await apiClient.get(
          `/recommend_${algo}/${userId}/context/${product.itemId}`
        );
        setContextRecs((prev) => ({ 
          ...prev, 
          [algo]: response.data.recommendations || [] 
        }));
      } catch (err) {
        console.error(`Failed to fetch ${algo} context:`, err);
        setErrors((prev) => ({ 
          ...prev, 
          [algo]: err.response?.data?.detail || err.message 
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, [algo]: false }));
      }
    });
  }, [isOpen, product, userId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContextRecs({});
      setIsLoading({});
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative inline-block w-full max-w-6xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Because you clicked "{product?.name || `Item #${product?.itemId}`}"
            </h2>
            <p className="text-gray-500 mt-1">
              Here is what each algorithm thinks you might also like...
            </p>
          </div>

          {/* Algorithm Tabs / Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(ALGORITHMS).map(([key, info]) => {
              const IconComponent = info.icon;
              const loading = isLoading[key];
              const error = errors[key];
              const recs = contextRecs[key] || [];

              return (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-5 h-5 mr-2 text-${info.color}-600`} />
                    <h3 className="font-semibold text-gray-900">{info.name}</h3>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  )}

                  {error && (
                    <div className="text-sm text-red-600 py-4">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      {error}
                    </div>
                  )}

                  {!loading && !error && recs.length === 0 && (
                    <p className="text-sm text-gray-500 py-4">No recommendations available</p>
                  )}

                  {!loading && !error && recs.length > 0 && (
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {recs.slice(0, 5).map((rec) => (
                        <div key={rec.itemId} className="flex-shrink-0 w-28">
                          {rec.image ? (
                            <img
                              src={rec.image}
                              alt={rec.name || `Item ${rec.itemId}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                              <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                          <p className="text-xs text-gray-700 mt-1 truncate">
                            {rec.name || `Item #${rec.itemId}`}
                          </p>
                          {rec.match_percentage && (
                            <p className="text-xs text-green-600">{rec.match_percentage}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Public Catalog Grid (when not logged in)
function PublicCatalog() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`/products/${page}/page/${pageSize}`);
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.response?.data?.detail || err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, [page]);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>💡 Tip:</strong> Select a user from the{' '}
          <Link to={ROUTES.USERS} className="underline hover:text-blue-600">
            Users page
          </Link>{' '}
          to see personalized recommendations from our 4 algorithms.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-t-lg" />
              <div className="p-3 space-y-2 bg-white rounded-b-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-red-800">Failed to load products</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.itemId}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || `Item ${product.itemId}`}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name || `Item #${product.itemId}`}
                  </h3>
                  <p className="text-gray-600 mt-1">{formatPrice(product.price)}</p>
                  {product.rating && (
                    <div className="flex items-center mt-2 text-sm text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {product.rating?.toFixed(1) || 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={products.length < pageSize}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Logged In Catalog (with algorithm rows)
function LoggedInCatalog({ userId }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-800">
          <strong>🎯 Personalized for User #{userId}:</strong> Click on any product to see what each algorithm 
          thinks you might also like based on that item.
        </p>
      </div>

      {/* Algorithm Recommendation Rows */}
      {['knn', 'svdpp', 'ncf', 'cbf'].map((algo) => (
        <RecommendationRow
          key={algo}
          algorithm={algo}
          userId={userId}
          onProductClick={handleProductClick}
        />
      ))}

      {/* Context Modal */}
      <ContextModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        userId={userId}
      />
    </div>
  );
}

// Main Catalog Page
export default function Catalog() {
  const { currentUserId, isAuthenticated } = useAuthContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAuthenticated ? 'Personalized Recommendations' : 'Product Catalog'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isAuthenticated
            ? 'Explore recommendations from 4 different algorithms: KNN, SVD++, NCF, and Content-Based Filtering.'
            : 'Browse our product catalog. Select a user to see personalized recommendations.'}
        </p>
      </div>

      {/* Content based on auth state */}
      {isAuthenticated ? (
        <LoggedInCatalog userId={currentUserId} />
      ) : (
        <PublicCatalog />
      )}
    </div>
  );
}
