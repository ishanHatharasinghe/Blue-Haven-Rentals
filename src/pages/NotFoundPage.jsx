import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-50 relative overflow-hidden flex items-center justify-center">
      {/* Main Content */}
      <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          {/* 404 Number */}
          <h1 className="text-9xl lg:text-[200px] font-bold text-slate-800">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-semibold text-slate-800">
              Page Not Found
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have
              been moved or deleted. Let's get you back on track.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </button>
            <button
              onClick={() => navigate("/browse")}
              className="bg-white hover:bg-gray-50 text-slate-700 font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Places
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-200/40 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default NotFoundPage;
