import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaChevronLeft,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { getPosts } from "../../firebase/dbService";
import { fetchImageUrl } from "../../firebase/storageService";
import placeholderImage from "../../assets/images/background/post-back.webp";

// Data from Location.jsx
const DISTRICTS = [
  { name: "Colombo", lat: 6.927079, lng: 79.861244, province: "Western" },
  { name: "Gampaha", lat: 7.0917, lng: 79.9999, province: "Western" },
  { name: "Kalutara", lat: 6.5854, lng: 79.9607, province: "Western" },
  { name: "Kandy", lat: 7.2906, lng: 80.6337, province: "Central" },
  { name: "Matale", lat: 7.4675, lng: 80.6234, province: "Central" },
  { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, province: "Central" },
  { name: "Galle", lat: 6.0535, lng: 80.221, province: "Southern" },
  { name: "Matara", lat: 5.9549, lng: 80.5549, province: "Southern" },
  { name: "Hambantota", lat: 6.1248, lng: 81.1134, province: "Southern" },
  { name: "Jaffna", lat: 9.6615, lng: 80.0255, province: "Northern" },
  { name: "Kilinochchi", lat: 9.3803, lng: 80.376, province: "Northern" },
  { name: "Mannar", lat: 8.9776, lng: 79.9058, province: "Northern" },
  { name: "Vavuniya", lat: 8.7514, lng: 80.497, province: "Northern" },
  { name: "Mullaitivu", lat: 9.2671, lng: 80.8128, province: "Northern" },
  { name: "Trincomalee", lat: 8.5874, lng: 81.2152, province: "Eastern" },
  { name: "Batticaloa", lat: 7.7102, lng: 81.6924, province: "Eastern" },
  { name: "Ampara", lat: 7.2973, lng: 81.682, province: "Eastern" },
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623, province: "North Western" },
  { name: "Puttalam", lat: 8.0362, lng: 79.839, province: "North Western" },
  {
    name: "Anuradhapura",
    lat: 8.3114,
    lng: 80.4037,
    province: "North Central",
  },
  { name: "Polonnaruwa", lat: 7.9403, lng: 81.0188, province: "North Central" },
  { name: "Badulla", lat: 6.989, lng: 81.056, province: "Uva" },
  { name: "Monaragala", lat: 6.8726, lng: 81.3509, province: "Uva" },
  { name: "Ratnapura", lat: 6.7056, lng: 80.3847, province: "Sabaragamuwa" },
  { name: "Kegalle", lat: 7.2507, lng: 80.345, province: "Sabaragamuwa" },
];

const PROVINCE_ORDER = [
  "Western",
  "Eastern",
  "Northern",
  "Central",
  "Southern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

// Categories from Categories.jsx
const CATEGORIES = [
  "Single Rooms",
  "Double Rooms",
  "Boarding Houses",
  "Hostels",
  "Sharing Rooms",
  "Annexes",
  "Houses",
  "Apartments",
];

// Property type mapping is no longer needed since home page now uses exact same categories

const BrowsePlacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [expandedProvinces, setExpandedProvinces] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [postImageUrls, setPostImageUrls] = useState({});
  const [highlyRatedPosts, setHighlyRatedPosts] = useState([]);
  const postsPerPage = 12;

  // Function to match search query to districts
  const matchSearchToDistricts = (searchQuery) => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase().trim();
    const matchedDistricts = [];

    // Common location keywords mapping
    const locationKeywords = {
      colombo: ["Colombo"],
      kandy: ["Kandy"],
      galle: ["Galle"],
      negombo: ["Gampaha"],
      wattala: ["Gampaha"],
      kadawatha: ["Gampaha"],
      kelaniya: ["Gampaha"],
      rathmalana: ["Colombo"],
      "mount lavinia": ["Colombo"],
      dehiwala: ["Colombo"],
      moratuwa: ["Colombo"],
      piliyandala: ["Colombo"],
      maharagama: ["Colombo"],
      kottawa: ["Colombo"],
      pannipitiya: ["Colombo"],
      battaramulla: ["Colombo"],
      rajagiriya: ["Colombo"],
      kotte: ["Colombo"],
      nugegoda: ["Colombo"],
      kohuwala: ["Colombo"],
      wellawatta: ["Colombo"],
      bambalapitiya: ["Colombo"],
      kollupitiya: ["Colombo"],
      fort: ["Colombo"],
      pettah: ["Colombo"],
      maradana: ["Colombo"],
      borella: ["Colombo"],
      narahenpita: ["Colombo"],
      "havelock town": ["Colombo"],
      "cinnamon gardens": ["Colombo"],
      "slave island": ["Colombo"],
      matara: ["Matara"],
      jaffna: ["Jaffna"],
      anuradhapura: ["Anuradhapura"],
      trincomalee: ["Trincomalee"],
      batticaloa: ["Batticaloa"],
      kurunegala: ["Kurunegala"],
      ratnapura: ["Ratnapura"],
      badulla: ["Badulla"],
      polonnaruwa: ["Polonnaruwa"],
      puttalam: ["Puttalam"],
      kalutara: ["Kalutara"],
      gampaha: ["Gampaha"],
      hambantota: ["Hambantota"],
      "nuwara eliya": ["Nuwara Eliya"],
      matale: ["Matale"],
      kilinochchi: ["Kilinochchi"],
      mannar: ["Mannar"],
      vavuniya: ["Vavuniya"],
      mullaitivu: ["Mullaitivu"],
      ampara: ["Ampara"],
      kegalle: ["Kegalle"],
      monaragala: ["Monaragala"],
    };

    // Check for keyword matches first
    for (const [keyword, districts] of Object.entries(locationKeywords)) {
      if (query.includes(keyword)) {
        matchedDistricts.push(...districts);
      }
    }

    // Direct district name matching
    DISTRICTS.forEach((district) => {
      if (
        district.name.toLowerCase().includes(query) ||
        query.includes(district.name.toLowerCase())
      ) {
        if (!matchedDistricts.includes(district.name)) {
          matchedDistricts.push(district.name);
        }
      }
    });

    // Province matching
    if (matchedDistricts.length === 0) {
      const matchedProvinces = PROVINCE_ORDER.filter(
        (province) =>
          province.toLowerCase().includes(query) ||
          query.includes(province.toLowerCase())
      );

      matchedProvinces.forEach((province) => {
        const districtsInProvince = DISTRICTS.filter(
          (d) => d.province === province
        );
        districtsInProvince.forEach((district) => {
          if (!matchedDistricts.includes(district.name)) {
            matchedDistricts.push(district.name);
          }
        });
      });
    }

    return matchedDistricts;
  };

  // Handle URL parameters on component mount
  useEffect(() => {
    const search = searchParams.get("search");
    const propertyType = searchParams.get("propertyType");
    const guests = searchParams.get("guests");
    const provinces = searchParams.get("provinces");

    if (search) {
      setSearchQuery(search);

      // Auto-select districts based on search query
      const matchedDistricts = matchSearchToDistricts(search);
      if (matchedDistricts.length > 0) {
        setSelectedDistricts(matchedDistricts);
        // Auto-expand provinces that contain matched districts
        const matchedProvinces = [
          ...new Set(
            matchedDistricts
              .map((districtName) => {
                const district = DISTRICTS.find((d) => d.name === districtName);
                return district ? district.province : null;
              })
              .filter(Boolean)
          ),
        ];
        setExpandedProvinces(matchedProvinces);
      }
    }

    if (propertyType && propertyType !== "All Property Types") {
      if (CATEGORIES.includes(propertyType)) {
        setSelectedCategories([propertyType]);
      }
    }

    if (provinces) {
      const provinceList = provinces.split(",");
      const districtsToSelect = [];
      provinceList.forEach((province) => {
        const districtsInProvince = DISTRICTS.filter(
          (d) => d.province === province
        );
        districtsInProvince.forEach((district) => {
          districtsToSelect.push(district.name);
        });
      });
      setSelectedDistricts(districtsToSelect);
    }

    // Reset page when URL parameters change
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch posts from Firestore on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getPosts();
        // Filter to show only approved posts to regular users
        const approvedPosts = fetchedPosts.filter(
          (post) => post.status === "approved"
        );
        setPosts(approvedPosts);
        
        // Get highly rated posts (posts with reviews, sorted by rating and review count)
        const postsWithReviews = approvedPosts.filter(post => 
          post.reviewCount && post.reviewCount > 0
        );
        const sortedByRating = postsWithReviews.sort((a, b) => {
          // First sort by average rating (descending)
          if (b.averageRating !== a.averageRating) {
            return (b.averageRating || 0) - (a.averageRating || 0);
          }
          // Then by review count (descending)
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        });
        setHighlyRatedPosts(sortedByRating.slice(0, 6)); // Show top 6
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && modalOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [modalOpen]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleDistrict = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
    setCurrentPage(1);
  };

  const toggleProvince = (province) => {
    setExpandedProvinces((prev) =>
      prev.includes(province)
        ? prev.filter((p) => p !== province)
        : [...prev, province]
    );
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(post.category);

      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(post.location); // Using location as district

      const matchesPrice =
        post.rent >= priceRange[0] && post.rent <= priceRange[1];

      return (
        matchesSearch && matchesCategory && matchesDistrict && matchesPrice
      );
    });
  }, [posts, searchQuery, selectedCategories, selectedDistricts, priceRange]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const districtsByProvince = useMemo(() => {
    const grouped = {};
    PROVINCE_ORDER.forEach((province) => {
      grouped[province] = DISTRICTS.filter((d) => d.province === province);
    });
    return grouped;
  }, []);

  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/rental+properties+sri+lanka`,
      "_blank"
    );
  };

  // Image helper functions
  const getPostImage = (post) => {
    if (!post.imageUrls || post.imageUrls.length === 0) {
      return placeholderImage;
    }
    return post.imageUrls[0];
  };

  const handleImageError = (postId) => {
    setImageLoadErrors((prev) => ({ ...prev, [postId]: true }));
  };

  const getImageSrc = (post) => {
    if (imageLoadErrors[post.id]) {
      return placeholderImage;
    }
    return getPostImage(post);
  };

  // Function to fetch real image URLs from Firebase Storage
  const fetchRealImageUrls = async (post) => {
    if (!post.imageUrls || post.imageUrls.length === 0) {
      return [placeholderImage];
    }

    try {
      // If imageUrls are already Firebase Storage URLs, return them directly
      if (
        post.imageUrls[0] &&
        post.imageUrls[0].includes("firebasestorage.googleapis.com")
      ) {
        return post.imageUrls;
      }

      // If imageUrls are paths, fetch the actual URLs
      const urls = await Promise.all(
        post.imageUrls.map(async (imagePath) => {
          try {
            return await fetchImageUrl(imagePath);
          } catch (error) {
            console.error("Error fetching image URL:", error);
            return placeholderImage;
          }
        })
      );
      return urls;
    } catch (error) {
      console.error("Error fetching image URLs for post:", post.id, error);
      return [placeholderImage];
    }
  };

  // Modal functions
  const openModal = async (index) => {
    setSelectedPostIndex(index);
    setCurrentImageIndex(0);
    setModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Fetch real image URLs for the selected post
    const post = paginatedPosts[index];
    if (post && !postImageUrls[post.id]) {
      try {
        const urls = await fetchRealImageUrls(post);
        setPostImageUrls((prev) => ({ ...prev, [post.id]: urls }));
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPostIndex(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = "unset"; // Restore scrolling
  };

  const goToPreviousPost = () => {
    if (selectedPostIndex > 0) {
      setSelectedPostIndex(selectedPostIndex - 1);
      setCurrentImageIndex(0);
    }
  };

  const goToNextPost = () => {
    if (selectedPostIndex < paginatedPosts.length - 1) {
      setSelectedPostIndex(selectedPostIndex + 1);
      setCurrentImageIndex(0);
    }
  };

  const goToPreviousImage = () => {
    const imageUrls = postImageUrls[selectedPost.id] || selectedPost.imageUrls;
    if (selectedPost && imageUrls && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    const imageUrls = postImageUrls[selectedPost.id] || selectedPost.imageUrls;
    if (selectedPost && imageUrls && currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const selectedPost =
    selectedPostIndex !== null ? paginatedPosts[selectedPostIndex] : null;

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl mt-15 p-4 border border-white/40 shadow-lg ">
        <h3 className="text-[#263D5D] font-bold text-lg mb-3 flex items-center gap-2">
          <MdFilterList /> Categories
        </h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-section">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#3ABBD0]/10 cursor-pointer transition"
            >
              <input
                type="checkbox"
                className="accent-[#3ABBD0] w-4 h-4"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <span className="text-sm text-[#263D5D] font-poppins">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Locations Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-lg">
        <h3 className="text-[#263D5D] font-bold text-lg mb-3">Locations</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-section">
          {PROVINCE_ORDER.map((province) => (
            <div key={province} className="border-b border-gray-200 pb-2">
              <button
                onClick={() => toggleProvince(province)}
                className="w-full flex items-center justify-between px-2 py-2 hover:bg-[#3ABBD0]/10 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-[#263D5D]">
                  {province}
                </span>
                {expandedProvinces.includes(province) ? (
                  <FaChevronUp className="text-[#263D5D]" size={12} />
                ) : (
                  <FaChevronDown className="text-[#263D5D]" size={12} />
                )}
              </button>
              {expandedProvinces.includes(province) && (
                <div className="ml-4 mt-2 space-y-1">
                  {districtsByProvince[province].map((district) => (
                    <label
                      key={district.name}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#3ABBD0]/5 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#3ABBD0] w-4 h-4"
                        checked={selectedDistricts.includes(district.name)}
                        onChange={() => toggleDistrict(district.name)}
                      />
                      <span className="text-xs text-[#263D5D] font-poppins">
                        {district.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View Map Button */}
      <button
        onClick={openInMaps}
        className="w-full relative overflow-hidden flex items-center gap-2 bg-[#263D5D] hover:bg-[#303435] text-white rounded-2xl px-4 py-3 shadow-lg border border-white/20 hover:scale-105 transition group"
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-black">
          <FaChevronRight />
        </span>
        <span className="font-semibold tracking-wide font-poppins">
          View Map
        </span>
        <div className="absolute inset-0 rounded-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </button>

      {/* Price Range Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-lg">
        <h3 className="text-[#263D5D] font-bold text-lg mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <span className="px-4 py-2 bg-[#3ABBD0]/20 text-[#263D5D] font-semibold rounded-xl text-sm">
              Rs. {priceRange[0].toLocaleString()} - Rs.{" "}
              {priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#263D5D] font-poppins mb-1 block">
                Min: Rs. {priceRange[0].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3ABBD0]"
              />
            </div>
            <div>
              <label className="text-xs text-[#263D5D] font-poppins mb-1 block">
                Max: Rs. {priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3ABBD0]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-[#263D5D] text-white p-3 rounded-full shadow-lg hover:bg-[#303435] transition"
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-[280px] lg:w-[320px] 
        bg-white/20 backdrop-blur-sm border-r border-white/30 
        overflow-y-auto p-4 pt-20 lg:pt-6 z-50
        transform transition-transform duration-300
        custom-scrollbar-sidebar
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <SidebarContent />
      </aside>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen max-w-[1600px] mx-auto">
        {/* Main Content Area */}
        <main className="min-h-screen p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 lg:ml-[320px]">
          {/* Header */}
          <div className="text-center mb-6 animate-fadeInUp">
            <h1 className="text-[48px] md:text-[72px] lg:text-[80px] leading-none font-[Hugiller-Demo] mt-10">
              <span className="text-[#263D5D]">Browse </span>
              <span className="text-[#3ABBD0]">Place</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6 animate-slideInRight relative max-w-4xl mx-auto">
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 w-full shadow-2xl border border-white/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"></div>

              {/* Search Input */}
              <div className="relative group w-full z-10">
                <div className="bg-gray-50/80 backdrop-blur-sm shadow-md h-[64px] flex items-center px-4 gap-3 rounded-2xl border-2 border-[#3ABBD0]/30 focus-within:border-[#3ABBD0] transition-all duration-300 group-hover:border-[#3ABBD0]/50 focus-within:ring-4 focus-within:ring-[#3ABBD0]/20">
                  <FaSearch className="text-[#263D5D] opacity-70" size={18} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-[#263D5D] font-poppins focus:outline-none placeholder-[#263D5D]/70"
                    placeholder="Search by location or property name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-[#263D5D] font-poppins text-sm">
            {loading
              ? "Loading..."
              : `Showing ${paginatedPosts.length} of ${filteredPosts.length} properties`}
          </div>

          {/* Highly Rated Section */}
          {!loading && highlyRatedPosts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#263D5D] flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#3ABBD0]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Recent & Highly Rated
                </h2>
                <span className="text-sm text-gray-500">
                  Top rated properties with reviews
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlyRatedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    onClick={() => openModal(posts.findIndex(p => p.id === post.id))}
                    className="group bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={getImageSrc(post)}
                        alt={post.title}
                        onError={() => handleImageError(post.id)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {post.imageUrls && post.imageUrls.length > 1 && (
                        <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                          {post.imageUrls.length} photos
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-[#3ABBD0] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Rs. {post.rent?.toLocaleString()}
                      </div>
                      {/* Rating Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#263D5D] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {post.averageRating?.toFixed(1) || '0.0'} ({post.reviewCount || 0} reviews)
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[#263D5D] font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[#263D5D]/70 text-sm font-poppins mb-1">
                        {post.location}
                      </p>
                      <p className="text-[#3ABBD0] text-xs font-poppins">
                        {post.category}
                      </p>
                      {post.forWhom && (
                        <p className="text-[#263D5D]/60 text-xs font-poppins mt-1">
                          For {post.forWhom}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3ABBD0]"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <svg
                className="w-16 h-16 text-[#263D5D]/30 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#263D5D] mb-2">
                No posts found
              </h3>
              <p className="text-[#263D5D]/70">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPosts.map((post, index) => {
                return (
                  <div
                    key={post.id}
                    onClick={() => openModal(index)}
                    className="group bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={getImageSrc(post)}
                        alt={post.title}
                        onError={() => handleImageError(post.id)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {post.imageUrls && post.imageUrls.length > 1 && (
                        <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                          {post.imageUrls.length} photos
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-[#3ABBD0] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Rs. {post.rent?.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[#263D5D] font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[#263D5D]/70 text-sm font-poppins mb-1">
                        {post.location}
                      </p>
                      <p className="text-[#3ABBD0] text-xs font-poppins">
                        {post.category}
                      </p>
                      {post.forWhom && (
                        <p className="text-[#263D5D]/60 text-xs font-poppins mt-1">
                          For {post.forWhom}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 text-[#263D5D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-poppins transition ${
                      currentPage === page
                        ? "bg-[#3ABBD0] text-white"
                        : "bg-white/60 backdrop-blur-xl border border-white/40 text-[#263D5D] hover:bg-white/80"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 text-[#263D5D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Post Detail Modal */}
      {modalOpen && selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-[5px] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Close modal"
            >
              <FaTimes className="text-[#263D5D] text-xl" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={goToPreviousPost}
              disabled={selectedPostIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Previous post"
            >
              <FaChevronLeft className="text-[#263D5D] text-xl md:text-2xl" />
            </button>

            <button
              onClick={goToNextPost}
              disabled={selectedPostIndex === paginatedPosts.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Next post"
            >
              <FaChevronRight className="text-[#263D5D] text-xl md:text-2xl" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-2/5 relative">
                <div className="relative h-48 md:h-56 lg:h-48 bg-gray-200">
                  <img
                    src={
                      postImageUrls[selectedPost.id] &&
                      postImageUrls[selectedPost.id].length > 0
                        ? postImageUrls[selectedPost.id][currentImageIndex]
                        : selectedPost.imageUrls &&
                          selectedPost.imageUrls.length > 0
                        ? selectedPost.imageUrls[currentImageIndex]
                        : placeholderImage
                    }
                    alt={selectedPost.title}
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                    className="w-full h-full object-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                  />

                  {/* Image Navigation Arrows (if multiple images) */}
                  {((postImageUrls[selectedPost.id] &&
                    postImageUrls[selectedPost.id].length > 1) ||
                    (selectedPost.imageUrls &&
                      selectedPost.imageUrls.length > 1)) && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPreviousImage();
                        }}
                        disabled={currentImageIndex === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FaChevronLeft className="text-[#263D5D] text-lg" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextImage();
                        }}
                        disabled={
                          currentImageIndex ===
                          selectedPost.imageUrls.length - 1
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FaChevronRight className="text-[#263D5D] text-lg" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {currentImageIndex + 1} /{" "}
                        {postImageUrls[selectedPost.id]
                          ? postImageUrls[selectedPost.id].length
                          : selectedPost.imageUrls.length}
                      </div>
                    </>
                  )}
                </div>

                <div className="absolute top-4 left-4 bg-[#3ABBD0] text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  Rs. {selectedPost.rent?.toLocaleString()}
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:w-3/5 p-4 md:p-6 space-y-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#263D5D] mb-2">
                    {selectedPost.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block bg-[#3ABBD0]/20 text-[#3ABBD0] px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedPost.category}
                    </span>
                    {selectedPost.forWhom && (
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        For {selectedPost.forWhom}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h3 className="text-base font-semibold text-[#263D5D] mb-2 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Location
                  </h3>
                  <p className="text-[#263D5D]/80 font-poppins ml-7">
                    {selectedPost.location}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h3 className="text-base font-semibold text-[#263D5D] mb-2 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    Description
                  </h3>
                  <p className="text-[#263D5D]/80 font-poppins ml-7 text-sm md:text-base leading-relaxed">
                    {selectedPost.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h3 className="text-base font-semibold text-[#263D5D] mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2 ml-2">
                    {selectedPost.ownerName && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#3ABBD0] mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-[#263D5D]/60 font-poppins">
                            Owner Name
                          </p>
                          <p className="text-[#263D5D] font-poppins font-medium">
                            {selectedPost.ownerName}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedPost.email && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#3ABBD0] mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-[#263D5D]/60 font-poppins">
                            Email
                          </p>
                          <a
                            href={`mailto:${selectedPost.email}`}
                            className="text-[#3ABBD0] hover:text-cyan-600 font-poppins font-medium break-all"
                          >
                            {selectedPost.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedPost.mobile && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#3ABBD0] mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-[#263D5D]/60 font-poppins">
                            Mobile
                          </p>
                          <a
                            href={`tel:+94${selectedPost.mobile}`}
                            className="text-[#3ABBD0] hover:text-cyan-600 font-poppins font-medium"
                          >
                            +94 {selectedPost.mobile}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        
        /* Custom Scrollbar - Sidebar */
        .custom-scrollbar-sidebar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3ABBD0 0%, #263D5D 100%);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #48d4e8 0%, #2e4a6d 100%);
        }
        
        /* Custom Scrollbar - Internal Sections */
        .custom-scrollbar-section::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar-section::-webkit-scrollbar-track {
          background: rgba(58, 187, 208, 0.05);
          border-radius: 8px;
        }
        .custom-scrollbar-section::-webkit-scrollbar-thumb {
          background: rgba(58, 187, 208, 0.4);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .custom-scrollbar-section::-webkit-scrollbar-thumb:hover {
          background: rgba(58, 187, 208, 0.6);
        }
        
        /* Standard Scrollbar Properties (Firefox) */
        .custom-scrollbar-sidebar {
          scrollbar-width: thin;
          scrollbar-color: #3ABBD0 rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar-section {
          scrollbar-width: thin;
          scrollbar-color: rgba(58, 187, 208, 0.4) rgba(58, 187, 208, 0.05);
        }
      `}</style>
    </div>
  );
};

export default BrowsePlacePage;
