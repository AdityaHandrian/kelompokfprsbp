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
  MessageSquare, // Icon baru
} from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { isAuthenticated, currentUserId } = useAuthContext();

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
            Login sebagai: <strong className="ml-1">User #{currentUserId}</strong>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Fitur & Model AI
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Sentiment Analysis Feature - Highlighted */}
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

            {/* Existing Algorithms */}
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">KNN</h3>
              <p className="text-sm text-gray-600">
                Item-based collaborative filtering (Cosine Similarity).
              </p>
            </div>

            <div className="p-6 rounded-xl bg-purple-50 border border-purple-200">
              <div className="w-12 h-12 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SVD++</h3>
              <p className="text-sm text-gray-600">
                Matrix factorization dengan implicit feedback.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-green-50 border border-green-200">
              <div className="w-12 h-12 rounded-lg bg-green-500 text-white flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">NCF</h3>
              <p className="text-sm text-gray-600">
                Neural Collaborative Filtering (Deep Learning).
              </p>
            </div>

            <div className="p-6 rounded-xl bg-orange-50 border border-orange-200">
              <div className="w-12 h-12 rounded-lg bg-orange-500 text-white flex items-center justify-center mb-4">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CBF</h3>
              <p className="text-sm text-gray-600">
                Content-Based Filtering berdasarkan fitur item.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white shadow-xl">
            <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
            <p className="text-lg mb-8 text-blue-100">
              {isAuthenticated 
                ? 'Jelajahi katalog produk dengan rekomendasi yang dipersonalisasi.'
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