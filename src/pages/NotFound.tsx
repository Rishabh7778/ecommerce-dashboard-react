import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  // LocalStorage se user ka role check karein
  const getRedirectPath = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Agar role admin hai toh admin dashboard par bhejo
      if (user.role === 'admin') {
        return '/admin-orders'; // Aapka jo bhi admin path ho
      }
    }
    // Default Home path
    return '/';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full text-center">

        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg border border-gray-100">
              <FileQuestion size={64} className="text-[#3BB77E]" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-[#253D4E] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Bhai, lagta hai aap galat raste par aa gaye hain. Ye page hamare database mein nahi mila.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate(getRedirectPath())}
            className="flex items-center justify-center gap-2 py-4 px-8 bg-[#3BB77E] hover:bg-[#2fa06c] text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all transform hover:-translate-y-1"
          >
            <Home size={20} />
            Go Home
          </button>

          {/* <button
            onClick={() => navigate(-1)} // Ek step piche jane ke liye
            className="flex items-center justify-center gap-2 py-4 px-8 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} />
            Go Back
          </button> */}
        </div>

        {/* Decorative element */}
        <div className="mt-12 text-xs text-gray-400 uppercase tracking-widest">
          Dealport E-commerce System
        </div>
      </div>
    </div>
  );
};

export default NotFound;