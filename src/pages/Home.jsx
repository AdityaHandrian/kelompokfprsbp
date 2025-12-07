import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuthContext();

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
            Mulai Sekarang
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
              Mulai Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
