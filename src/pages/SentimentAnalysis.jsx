import { useState } from 'react';
import { analyzeSentiment } from '../api/apiClient';
import ReviewCard from '../components/ReviewCard';
import SentimentChart from '../components/SentimentChart';
import { AlertCircle, Loader, Send, Trash, Brain, MessageSquare } from 'lucide-react';

export default function SentimentAnalysis() {
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      setError('Masukkan teks review terlebih dahulu');
      return;
    }

    if (reviewText.trim().length < 5) { // Adjusted min length
      setError('Review terlalu pendek (minimal 5 karakter)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Panggil API real
      const response = await analyzeSentiment(reviewText);
      const data = response.data; // Asumsi response: { sentiment: 'positive', confidence: 0.98 }

      // Tambahkan review ke list state
      setReviews((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: reviewText,
          sentiment: data.sentiment || 'neutral', // Fallback jika undefined
          confidence: data.confidence || 0,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        },
      ]);

      setSuccessMessage('Review berhasil dianalisis oleh AI!');
      setReviewText('');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Gagal menganalisis sentimen. Pastikan backend berjalan dan endpoint tersedia.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Remove review
  const handleRemoveReview = (index) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all reviews
  const handleClearAll = () => {
    if (reviews.length === 0) return;
    if (window.confirm('Hapus semua review?')) {
      setReviews([]);
      setSuccessMessage(null);
      setError(null);
    }
  };

  // Calculate sentiment percentages
  const calculateSentimentStats = () => {
    if (reviews.length === 0) {
      return {
        positive: { percentage: 0, label: 'Positif', count: 0 },
        neutral: { percentage: 0, label: 'Netral', count: 0 },
        negative: { percentage: 0, label: 'Negatif', count: 0 },
      };
    }

    const counts = {
      positive: reviews.filter((r) => r.sentiment === 'positive').length,
      neutral: reviews.filter((r) => r.sentiment === 'neutral').length,
      negative: reviews.filter((r) => r.sentiment === 'negative').length,
    };

    const total = reviews.length;

    return {
      positive: {
        percentage: Math.round((counts.positive / total) * 100),
        label: 'Positif',
        count: counts.positive,
      },
      neutral: {
        percentage: Math.round((counts.neutral / total) * 100),
        label: 'Netral',
        count: counts.neutral,
      },
      negative: {
        percentage: Math.round((counts.negative / total) * 100),
        label: 'Negatif',
        count: counts.negative,
      },
    };
  };

  const sentimentStats = calculateSentimentStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-pink-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analisis Sentimen AI
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Demo analisis sentimen ulasan produk menggunakan model NLP. 
          Ketik ulasan di bawah untuk melihat prediksi AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Input Review Baru
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start space-x-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              {successMessage && (
                <div className="rounded-md bg-green-50 p-4 border border-green-200">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}

              <div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onFocus={() => setError(null)}
                  placeholder="Contoh: Barangnya bagus banget, pengiriman cepat!"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !reviewText.trim()}
                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all ${
                  isLoading || !reviewText.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2" size={20} />
                    Analisis Sekarang
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Reviews */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Riwayat Analisis ({reviews.length})
              </h2>
              {reviews.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <Trash size={16} className="mr-1" />
                  Hapus Semua
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Belum ada data review.</p>
                <p className="text-sm text-gray-400 mt-1">Gunakan form di atas untuk mencoba.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onRemove={handleRemoveReview}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Statistik Real-time
            </h2>
            
            {reviews.length > 0 ? (
              <>
                <SentimentChart scores={sentimentStats} />
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-700">{sentimentStats.positive.count}</div>
                      <div className="text-xs text-green-600">Positif</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-700">{sentimentStats.neutral.count}</div>
                      <div className="text-xs text-yellow-600">Netral</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-700">{sentimentStats.negative.count}</div>
                      <div className="text-xs text-red-600">Negatif</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Menunggu data analisis...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}