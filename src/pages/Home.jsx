import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Brain,
  Search,
  Filter,
  Zap,
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, currentUserId } = useAuthContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4 mr-2" />
          Recommendation Algorithm Demo
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Explore How Different
          <span className="block text-blue-600">Algorithms Recommend</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          This demo showcases how different recommendation algorithms (KNN, SVD++, NCF, CBF) 
          suggest items to users. Select a user to see personalized recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={isAuthenticated ? ROUTES.CATALOG : ROUTES.USERS}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            {isAuthenticated ? 'View Recommendations' : 'Login / Select User'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          {isAuthenticated && (
            <Link
              to={ROUTES.USERS}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              Switch User
            </Link>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-8 inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            Welcome back, <strong className="ml-1">User #{currentUserId}</strong>!
          </div>
        )}
      </section>

      {/* Algorithm Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            4 Recommendation Algorithms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KNN */}
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">KNN</h3>
              <p className="text-sm text-gray-600">
                K-Nearest Neighbors: Item-based collaborative filtering using cosine similarity.
              </p>
            </div>

            {/* SVD++ */}
            <div className="p-6 rounded-xl bg-purple-50 border border-purple-200">
              <div className="w-12 h-12 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SVD++</h3>
              <p className="text-sm text-gray-600">
                Latent factor model with matrix factorization and implicit feedback.
              </p>
            </div>

            {/* NCF */}
            <div className="p-6 rounded-xl bg-green-50 border border-green-200">
              <div className="w-12 h-12 rounded-lg bg-green-500 text-white flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">NCF</h3>
              <p className="text-sm text-gray-600">
                Neural Collaborative Filtering: Deep learning-based recommendation model.
              </p>
            </div>

            {/* CBF */}
            <div className="p-6 rounded-xl bg-orange-50 border border-orange-200">
              <div className="w-12 h-12 rounded-lg bg-orange-500 text-white flex items-center justify-center mb-4">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CBF</h3>
              <p className="text-sm text-gray-600">
                Content-Based Filtering: Recommends based on item features and user preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white shadow-xl">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-lg mb-8">
              {isAuthenticated 
                ? 'Head to the catalog to see personalized recommendations from all 4 algorithms.'
                : 'Select a user to start receiving personalized recommendations.'}
            </p>

            <Link
              to={isAuthenticated ? ROUTES.CATALOG : ROUTES.USERS}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? 'Go to Catalog' : 'Select a User'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
