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
  MessageSquare,
  Loader,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Home() {
  const { user, isAuthenticated, currentUserId } = useAuthContext();
  const [ncfRecommendations, setNcfRecommendations] = useState([]);
  const [cbfRecommendations, setCbfRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rekomendasi kalau sudah login
  useEffect(() => {
    if (isAuthenticated && (user?.id || currentUserId)) {
      fetchRecommendations();
    }
  }, [isAuthenticated, user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    const userId = user?.id || currentUserId;

    try {
      const [ncfRes, cbfRes] = await Promise.all([
        apiClient.get(`/recommend_ncf/${userId}`),
        apiClient.get(`/recommend_cbf/${userId}`),
      ]);

      setNcfRecommendations(ncfRes.data.recommendations || []);
      setCbfRecommendations(cbfRes.data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat rekomendasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4 mr-2" />
          AI-Powered Recommendation System
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Sistem Rekomendasi & 
          <span className="block text-blue-600">Analisis Sentimen Cerdas</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Eksplorasi 4 algoritma rekomendasi (NCF, CBF, KNN, SVD++) dan fitur analisis 
          sentimen otomatis untuk meningkatkan pengalaman e-commerce.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={isAuthenticated ? ROUTES.CATALOG : ROUTES.USERS}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            {isAuthenticated ? 'Lihat Katalog' : 'Pilih User Demo'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          <Link
            to={ROUTES.SENTIMENT}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="mr-2 w-5 h-5" />
            Coba Sentiment Analysis
          </Link>
        </div>

        {isAuthenticated && (
          <div className="mt-8 inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 mr-2" />
            Login sebagai: <strong className="ml-1">{user?.name || `User #${currentUserId}`}</strong>
          </div>
        )}
      </section>

      {/* Feature Showcase / Grid  */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Fitur & Model AI
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Sentiment */}
            <Link to={ROUTES.SENTIMENT} className="block group h-full">
              <div className="h-full p-6 rounded-xl bg-pink-50 border-2 border-pink-200 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                  NEW
                </div>
                <div className="w-12 h-12 rounded-lg bg-pink-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sentiment Analysis</h3>
                <p className="text-sm text-gray-600">
                  Mendeteksi emosi ulasan (Positif, Netral, Negatif) menggunakan NLP.
                </p>
              </div>
            </Link>

            {/* Others */}
            <Feature icon={<Search />} title="KNN" desc="Item-based collaborative filtering (Cosine Similarity)." color="blue" />
            <Feature icon={<TrendingUp />} title="SVD++" desc="Matrix factorization dengan implicit feedback." color="purple" />
            <Feature icon={<Brain />} title="NCF" desc="Neural Collaborative Filtering (Deep Learning)." color="green" />
            <Feature icon={<Filter />} title="CBF" desc="Content-Based Filtering berdasarkan fitur item." color="orange" />
          </div>
        </div>
      </section>

      {/* Comparison Section (muncul ketika login) */}
      {isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Komparasi Sistem Rekomendasi
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Bandingkan hasil dari dua algoritma rekomendasi untuk menemukan produk terbaik untukmu
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
                <button onClick={fetchRecommendations} className="ml-4 underline font-semibold">
                  Coba Lagi
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Memuat rekomendasi...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecommendationColumn
                  title="NCF"
                  subtitle="Neural Collaborative Filtering"
                  color="blue"
                  recommendations={ncfRecommendations}
                />
                <RecommendationColumn
                  title="CBF"
                  subtitle="Content-Based Filtering"
                  color="purple"
                  recommendations={cbfRecommendations}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white shadow-xl">
            <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
            <p className="text-lg mb-8 text-blue-100">
              {isAuthenticated 
                ? 'Jelajahi katalog dengan rekomendasi yang dipersonalisasi.'
                : 'Pilih user demo untuk melihat bagaimana algoritma bekerja.'}
            </p>

            <Link
              to={isAuthenticated ? ROUTES.CATALOG : ROUTES.USERS}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? 'Buka Katalog' : 'Pilih User'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* COMPONENT: For Feature grid */
function Feature({ icon, title, desc, color }) {
  return (
    <div className={`p-6 rounded-xl bg-${color}-50 border border-${color}-200`}>
      <div className={`w-12 h-12 rounded-lg bg-${color}-500 text-white flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

/* COMPONENT: For NCF / CBF comparison (UPDATED) */
function RecommendationColumn({ title, subtitle, color, recommendations }) {
  return (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl p-8 border border-${color}-200`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-6">{subtitle}</p>

      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.slice(0, 5).map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-12 h-12 bg-${color}-200 rounded-lg flex items-center justify-center font-bold text-${color}-700`}>
                  #{i + 1}
                </div>
                
                {/* UPDATED: 
                  - Added min-w-0 to prevent flex item from overflowing container 
                  - Removed 'truncate', used 'line-clamp-2' for multi-line support
                  - Added 'text-sm' for better fit
                */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm break-words line-clamp-2 leading-snug">
                    {item.name || `Produk ${item.product_id}`}
                  </h4>
                  {item.score && (
                    <p className="text-xs text-gray-600 mt-1">
                      Skor: {typeof item.score === 'number' ? item.score.toFixed(2) : item.score}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">Tidak ada rekomendasi tersedia</div>
        )}
      </div>

      {recommendations.length > 0 && (
        <Link
          to={ROUTES.RECOMMENDATION}
          className={`mt-6 block text-center py-2 px-4 bg-${color}-600 text-white font-semibold rounded-lg hover:bg-${color}-700 transition-colors`}
        >
          Lihat Selengkapnya
        </Link>
      )}
    </div>
  );
}