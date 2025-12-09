import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { ArrowRight, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  // Redirect to Users page since we use user selection model
  useEffect(() => {
    // Auto redirect after a short delay to show message
    const timer = setTimeout(() => {
      navigate(ROUTES.USERS);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Header */}
        <div>
          <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Select a User
          </h2>
          <p className="mt-4 text-gray-600">
            This is a demo application. Instead of traditional login, 
            you'll select a user from our database to simulate being logged in.
          </p>
        </div>

        {/* Redirect Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 mb-4">
            Redirecting you to the User Selection page...
          </p>
          <button
            onClick={() => navigate(ROUTES.USERS)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Go to Users Page
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="rounded-md bg-gray-100 p-4">
          <p className="text-sm text-gray-700">
            💡 <strong>How it works:</strong> Select any user from the list to see 
            personalized recommendations from 4 different algorithms (KNN, SVD++, NCF, CBF).
          </p>
        </div>
      </div>
    </div>
  );
}
