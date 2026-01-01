import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Home,
  TrendingUp,
  Settings,
  LayoutDashboard,
  Building2,
  UserCheck,
  ShieldAlert,
  PlusCircle,
  Search,
  Star,
  MessageSquare,
} from "lucide-react";
import { getPostStatistics, getUserStatistics, getAllReviews } from "../../firebase/dbService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    boardingOwners: 0,
    typicalUsers: 0,
    totalReviews: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStats, postStats, reviews] = await Promise.all([
          getUserStatistics(),
          getPostStatistics(),
          getAllReviews(),
        ]);

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;

        setStats({
          totalUsers: userStats.totalUsers,
          totalListings: postStats.totalPosts,
          boardingOwners: userStats.boardingOwners,
          typicalUsers: userStats.boardingFinders,
          totalReviews: reviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to placeholder values
        setStats({
          totalUsers: 150,
          totalListings: 45,
          boardingOwners: 30,
          typicalUsers: 120,
          totalReviews: 0,
          averageRating: 0,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#263D5D] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {userProfile?.firstName || "Admin"}! Here's what's
            happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#3ABBD0]/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-[#263D5D]">
                  {stats.totalUsers}
                </h3>
              </div>
              <div className="w-12 h-12 bg-[#3ABBD0]/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#3ABBD0]" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Total Listings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-300/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Listings</p>
                <h3 className="text-3xl font-bold text-[#263D5D]">
                  {stats.totalListings}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Boarding Owners */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-300/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Boarding Owners</p>
                <h3 className="text-3xl font-bold text-[#263D5D]">
                  {stats.boardingOwners}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Typical Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-300/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Typical Users</p>
                <h3 className="text-3xl font-bold text-[#263D5D]">
                  {stats.typicalUsers}
                </h3>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-300/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Reviews</p>
                <h3 className="text-3xl font-bold text-[#263D5D]">
                  {stats.totalReviews}
                </h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-yellow-500">{stats.averageRating}/5.0</span>
              <span className="text-gray-500 ml-1">avg rating</span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-300/30 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Avg Rating</p>
                <h3 className="text-3xl font-bold text-[#263D5D]">
                  {stats.averageRating}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-gray-500 ml-1">platform rating</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#263D5D] mb-6 flex items-center">
            <LayoutDashboard className="w-6 h-6 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center justify-center space-x-2 bg-[#3ABBD0] hover:bg-[#2BA9C1] text-white px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
            >
              <Search className="w-5 h-5" />
              <span>Browse Listings</span>
            </button>
            <button
              onClick={() => navigate("/post-add")}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Post</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md">
              <Home className="w-5 h-5" />
              <span>Manage Listings</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md">
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </button>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">
                Admin Access Notice
              </h3>
              <p className="text-amber-800 mb-3">
                You have full administrative access to the Blue Haven Rentals
                platform. As an admin, you have unrestricted access to all
                features and pages, including:
              </p>
              <ul className="text-amber-800 list-disc list-inside space-y-1 ml-2">
                <li>Create and manage posts (boarding owner privileges)</li>
                <li>Browse and view all listings</li>
                <li>Access user profiles and settings</li>
                <li>Manage system configurations</li>
              </ul>
              <p className="text-amber-800 mt-3 text-sm">
                Please use your privileges responsibly and ensure all actions
                comply with the platform's policies and guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
