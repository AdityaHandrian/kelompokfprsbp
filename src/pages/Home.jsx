import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Loader,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { user, isAuthenticated } = useAuthContext();
  const [ncfRecommendations, setNcfRecommendations] = useState([]);
  const [cbfRecommendations, setCbfRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchRecommendations();
    }
  }, [isAuthenticated, user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ncfRes, cbfRes] = await Promise.all([
        apiClient.get(`/recommend_ncf/${user.id}`),
        apiClient.get(`/recommend_cbf/${user.id}`),
      ]);

      setNcfRecommendations(ncfRes.data.recommendations || []);
      setCbfRecommendations(cbfRes.data.recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
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
          Rekomendasi Produk Tokopedia Terbaik
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Temukan Produk Terbaik dengan
          <span className="block text-blue-600">Kecerdasan Buatan</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Sistem rekomendasi produk Tokopedia yang menggunakan analisis sentimen,
          collaborative filtering, dan algoritma SVD++ untuk memberikan rekomendasi yang paling relevan untukmu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={isAuthenticated ? ROUTES.RECOMMENDATION : ROUTES.LOGIN}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            {isAuthenticated ? 'Lihat Semua Rekomendasi' : 'Mulai Sekarang'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          <Link
            to={ROUTES.SENTIMENT}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            Coba Analisis Sentimen
          </Link>
        </div>

        {isAuthenticated && (
          <div className="mt-8 inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            Selamat datang kembali,
            <strong className="ml-1">{user.name}</strong>!
          </div>
        )}
      </section>

      {/* Comparison Section - Hanya tampil jika sudah login */}
      {isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Komparasi Sistem Rekomendasi
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Bandingkan hasil dari dua algoritma rekomendasi berbeda untuk menemukan produk yang paling sesuai dengan preferensimu
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
                <button
                  onClick={fetchRecommendations}
                  className="ml-4 underline hover:no-underline font-semibold"
                >
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
                {/* NCF Column */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">NCF</h3>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Neural Collaborative Filtering</span>
                      <br />
                      Menggunakan jaringan saraf untuk mempelajari pola interaksi pengguna-produk
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-6 p-3 bg-blue-100 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Cocok untuk: Pola interaksi kompleks & preferensi tersembunyi
                    </span>
                  </div>

                  <div className="space-y-4">
                    {ncfRecommendations.length > 0 ? (
                      ncfRecommendations.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center font-bold text-blue-700">
                              #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {item.name || `Produk ${item.product_id}`}
                              </h4>
                              {item.score && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Skor: {typeof item.score === 'number' ? item.score.toFixed(2) : item.score}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Tidak ada rekomendasi tersedia</p>
                      </div>
                    )}
                  </div>

                  {ncfRecommendations.length > 0 && (
                    <Link
                      to={ROUTES.RECOMMENDATION}
                      className="mt-6 block text-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Lihat Selengkapnya
                    </Link>
                  )}
                </div>

                {/* CBF Column */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">CBF</h3>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Content-Based Filtering</span>
                      <br />
                      Merekomendasikan produk berdasarkan karakteristik & fitur produk
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-6 p-3 bg-purple-100 rounded-lg">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Cocok untuk: Produk dengan fitur spesifik & kategori sejenis
                    </span>
                  </div>

                  <div className="space-y-4">
                    {cbfRecommendations.length > 0 ? (
                      cbfRecommendations.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center font-bold text-purple-700">
                              #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {item.name || `Produk ${item.product_id}`}
                              </h4>
                              {item.score && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Skor: {typeof item.score === 'number' ? item.score.toFixed(2) : item.score}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Tidak ada rekomendasi tersedia</p>
                      </div>
                    )}
                  </div>

                  {cbfRecommendations.length > 0 && (
                    <Link
                      to={ROUTES.RECOMMENDATION}
                      className="mt-6 block text-center py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Lihat Selengkapnya
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Siap Menemukan Produk Terbaik?</h2>
            <p className="text-lg mb-8">
              Jelajahi ribuan produk dengan rekomendasi paling relevan — lebih cepat dan lebih akurat.
            </p>

            <Link
              to={isAuthenticated ? ROUTES.RECOMMENDATION : ROUTES.LOGIN}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? 'Lihat Semua Rekomendasi' : 'Mulai Sekarang'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}