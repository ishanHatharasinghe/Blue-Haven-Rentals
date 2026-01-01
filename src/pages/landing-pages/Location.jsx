// FindCity.jsx (JSX version, with updated buttons, routing for View More, and full city list)
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaChevronDown,
  FaSlidersH,
  FaChevronRight,
} from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

import Home from "../../assets/images/background/location-background.webp";

const DISTRICTS = [
  // Western
  { name: "Colombo", lat: 6.927079, lng: 79.861244, province: "Western" },
  { name: "Gampaha", lat: 7.0917, lng: 79.9999, province: "Western" },
  { name: "Kalutara", lat: 6.5854, lng: 79.9607, province: "Western" },
  // Central
  { name: "Kandy", lat: 7.2906, lng: 80.6337, province: "Central" },
  { name: "Matale", lat: 7.4675, lng: 80.6234, province: "Central" },
  { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, province: "Central" },
  // Southern
  { name: "Galle", lat: 6.0535, lng: 80.221, province: "Southern" },
  { name: "Matara", lat: 5.9549, lng: 80.5549, province: "Southern" },
  { name: "Hambantota", lat: 6.1248, lng: 81.1134, province: "Southern" },
  // Northern
  { name: "Jaffna", lat: 9.6615, lng: 80.0255, province: "Northern" },
  { name: "Kilinochchi", lat: 9.3803, lng: 80.376, province: "Northern" },
  { name: "Mannar", lat: 8.9776, lng: 79.9058, province: "Northern" },
  { name: "Vavuniya", lat: 8.7514, lng: 80.497, province: "Northern" },
  { name: "Mullaitivu", lat: 9.2671, lng: 80.8128, province: "Northern" },
  // Eastern
  { name: "Trincomalee", lat: 8.5874, lng: 81.2152, province: "Eastern" },
  { name: "Batticaloa", lat: 7.7102, lng: 81.6924, province: "Eastern" },
  { name: "Ampara", lat: 7.2973, lng: 81.682, province: "Eastern" },
  // North Western
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623, province: "North Western" },
  { name: "Puttalam", lat: 8.0362, lng: 79.839, province: "North Western" },
  // North Central
  {
    name: "Anuradhapura",
    lat: 8.3114,
    lng: 80.4037,
    province: "North Central",
  },
  { name: "Polonnaruwa", lat: 7.9403, lng: 81.0188, province: "North Central" },
  // Uva
  { name: "Badulla", lat: 6.989, lng: 81.056, province: "Uva" },
  { name: "Monaragala", lat: 6.8726, lng: 81.3509, province: "Uva" },
  // Sabaragamuwa
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

// Categories from Categories.jsx and BrowsePlacePage
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

const VIEW_MORE_ROUTE = "/cities"; // <- change to your route path

const FindCity = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(DISTRICTS[0]);
  const [zoom, setZoom] = useState(9);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState([]);

  const mapWrapRef = useRef(null);
  const categoryRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        categoryOpen &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setCategoryOpen(false);
      }
      if (
        filtersOpen &&
        filtersRef.current &&
        !filtersRef.current.contains(e.target)
      ) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen, filtersOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISTRICTS.filter((d) => {
      const textMatch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q);
      const provinceMatch =
        selectedProvinces.length === 0 ||
        selectedProvinces.includes(d.province);
      return textMatch && provinceMatch;
    });
  }, [query, selectedProvinces]);

  const grouped = useMemo(() => {
    const by = {};
    for (const d of filtered) {
      if (!by[d.province]) by[d.province] = [];
      by[d.province].push(d);
    }
    Object.keys(by).forEach((p) =>
      by[p].sort((a, b) => a.name.localeCompare(b.name))
    );
    return by;
  }, [filtered]);

  const provincesOrdered = useMemo(
    () => PROVINCE_ORDER.filter((p) => grouped[p]?.length),
    [grouped]
  );

  const mapSrc = useMemo(() => {
    const { lat, lng } = selected;
    return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;
  }, [selected, zoom]);

  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`,
      "_blank"
    );
  };

  const onFind = () => {
    if (filtered.length > 0) {
      setSelected(filtered[0]);
      setZoom(10);
      mapWrapRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const handleSearchToBrowse = () => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.append("search", query.trim());
    }

    if (selectedProvinces.length > 0) {
      params.append("provinces", selectedProvinces.join(","));
    }

    const queryString = params.toString();
    navigate(`/browse${queryString ? `?${queryString}` : ""}`);
  };

  const toggleProvince = (prov) => {
    setSelectedProvinces((prev) =>
      prev.includes(prov) ? prev.filter((p) => p !== prov) : [...prev, prov]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedProvinces([]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 overflow-hidden p-6 md:p-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={Home}
          alt="Modern house"
          className="object-cover w-full h-full opacity-100"
        />
        <div className="w-full h-full bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFECF8]/80 to-transparent opacity-100 block md:hidden"></div>
      </div>

      {/* Hero Title */}
      <div className="text-center relative z-10 max-w-6xl mx-auto mb-6 md:mb-8 animate-fadeInUp">
        <h1 className="text-[64px] md:text-[112px] leading-none font-[Hugiller-Demo]">
          <span className="text-[#263D5D]">Choose a city </span>
          <span className="text-[#3ABBD0]">You Want</span>
        </h1>
      </div>

      {/* Search / Filters Bar */}
      <div className="mb-10 animate-slideInRight relative z-50">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 w-full flex flex-col md:flex-row items-center gap-4 shadow-2xl border border-white/30 max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"></div>

          {/* Search Input */}
          <div className="relative group flex-1 w-full md:w-auto">
            <div className="bg-gray-50/80 backdrop-blur-sm shadow-md h-[64px] flex items-center px-4 gap-3 rounded-2xl border-2 border-[#3ABBD0]/30 focus-within:border-[#3ABBD0] transition-all duration-300 group-hover:border-[#3ABBD0]/50 focus-within:ring-4 focus-within:ring-[#3ABBD0]/20">
              <FaSearch className="text-[#263D5D] opacity-70" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchToBrowse();
                  }
                }}
                className="flex-1 bg-transparent text-[14px] text-[#263D5D] font-poppins focus:outline-none placeholder-[#263D5D]/70"
                placeholder="Enter city, neighborhood"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Property Categories */}
          <div ref={categoryRef} className="relative group w-full md:w-[240px]">
            <button
              onClick={() => setCategoryOpen((v) => !v)}
              className="bg-gray-50/80 backdrop-blur-sm shadow-md h-[64px] w-full flex items-center px-4 gap-3 rounded-2xl border-2 border-[#3ABBD0]/30 focus:border-[#3ABBD0] transition-all duration-300 group-hover:border-[#3ABBD0]/50 focus:ring-4 focus:ring-[#3ABBD0]/20 cursor-pointer"
            >
              <FaSlidersH className="text-[#263D5D] opacity-70" size={18} />
              <span className="text-[14px] text-[#263D5D] font-poppins opacity-70 truncate flex-1 text-left">
                {selectedCategories.length === 0
                  ? "Any Property Type"
                  : selectedCategories.length === 1
                  ? selectedCategories[0]
                  : `${selectedCategories.length} selected`}
              </span>
              <FaChevronDown className="text-[#263D5D] opacity-60" size={12} />
            </button>
            {categoryOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#3ABBD0]/20 overflow-hidden max-h-[300px] overflow-y-auto">
                {CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-poppins hover:bg-[#3ABBD0]/10 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="accent-[#3ABBD0] w-4 h-4"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span className="text-[#263D5D]">{category}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Filters */}
          <div
            ref={filtersRef}
            className="relative z-1 group w-full md:w-[160px]"
          >
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="bg-gray-50/80 backdrop-blur-sm shadow-md h-[64px] w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-[#3ABBD0]/30 cursor-pointer hover:bg-gray-100/80 transition-all duration-300 group-hover:border-[#3ABBD0]/50 hover:scale-105"
            >
              <MdFilterList className="text-[#263D5D] opacity-70" size={20} />
              <span className="text-[14px] text-[#263D5D] font-poppins opacity-80">
                Filters
              </span>
              {selectedProvinces.length > 0 && (
                <span className="text-[11px] font-poppins bg-[#3ABBD0]/15 text-[#263D5D] px-2 py-0.5 rounded-full">
                  {selectedProvinces.length}
                </span>
              )}
            </button>
            {filtersOpen && (
              <div className="absolute z-20 right-0 mt-2 w-[min(92vw,380px)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#3ABBD0]/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[#263D5D] font-semibold font-['Hubballi'] text-lg">
                    Province
                  </div>
                  {selectedProvinces.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-poppins text-[#263D5D]/70 hover:text-[#263D5D] underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PROVINCE_ORDER.map((prov) => (
                    <label
                      key={prov}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#3ABBD0]/10 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#3ABBD0]"
                        checked={selectedProvinces.includes(prov)}
                        onChange={() => toggleProvince(prov)}
                      />
                      <span className="text-sm text-[#263D5D] font-poppins">
                        {prov}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="px-4 h-10 rounded-xl border border-[#3ABBD0]/30 text-[#263D5D] hover:bg-[#3ABBD0]/10 font-poppins"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setFiltersOpen(false);
                      handleSearchToBrowse();
                    }}
                    className="relative overflow-hidden px-5 h-10 rounded-xl bg-[#3ABBD0] text-white hover:bg-cyan-500 transition font-poppins group"
                  >
                    <span className="relative z-10">Apply</span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Find Button */}
          <button
            onClick={handleSearchToBrowse}
            className="relative overflow-hidden bg-[#3ABBD0] hover:bg-cyan-500 h-[62px] flex items-center justify-center gap-2 rounded-2xl border border-[#3ABBD0] w-full md:w-[142px] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaSearch className="text-white" size={16} />
              <span className="text-[14px] text-white font-poppins">Find</span>
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start animate-fadeInUp">
        {/* Map */}
        <div ref={mapWrapRef} className="relative">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-[28px] border border-white/40 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-transparent"></div>

            <div className="m-3 md:m-4 rounded-[24px] border-[4px] border-[#22B7EE] overflow-hidden shadow-xl h-[340px] md:h-[420px] lg:h-[480px]">
              <iframe
                key={`${selected.lat},${selected.lng},${zoom}`}
                src={mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Lanka Map"
              />
            </div>

            {/* Selected chip */}
            <div className="absolute top-4 left-4 bg-gray-50/80 backdrop-blur-sm shadow-md px-4 py-2 rounded-2xl border-2 border-[#3ABBD0]/30 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#263D5D] opacity-80" />
              <span className="text-sm text-[#263D5D] font-poppins">
                {selected.name}, {selected.province}
              </span>
            </div>

            {/* Map controls + Open */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <div className="flex items-center bg-gray-50/80 backdrop-blur-sm shadow-md rounded-2xl border-1 border-[#3ABBD0]/30 overflow-hidden">
                <button
                  onClick={() => setZoom((z) => Math.max(6, z - 1))}
                  className="px-3 py-2 text-[#263D5D] hover:bg-gray-100/80 transition-all duration-300"
                  aria-label="Zoom out"
                >
                  -
                </button>
                <div className="px-3 py-2 text-xs text-[#263D5D]/80 font-poppins">
                  Zoom {zoom}
                </div>
                <button
                  onClick={() => setZoom((z) => Math.min(16, z + 1))}
                  className="px-3 py-2 text-[#263D5D] hover:bg-gray-100/80 transition-all duration-300"
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>

              <button
                onClick={openInMaps}
                className="relative overflow-hidden bg-[#3ABBD0] hover:bg-cyan-500 h-[44px] px-4 flex items-center justify-center gap-2 rounded-2xl border border-[#3ABBD0] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <span className="relative z-10 flex items-center gap-2 text-white text-sm font-poppins">
                  Open in Maps <FaExternalLinkAlt size={12} />
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>

            {/* View Map overlay button (exact design you provided) */}
            <button
              onClick={openInMaps}
              className="absolute left-6 bottom-6 md:left-8 md:bottom-8 group"
              aria-label="View Map"
            >
              <div className="relative overflow-hidden flex items-center gap-2 bg-[#263D5D] hover:bg-[#303435] text-white rounded-2xl px-4 py-2 shadow-lg border border-white/20 hover:scale-105 transition group">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-black">
                  <FaChevronRight />
                </span>
                <span className="font-semibold tracking-wide font-poppins">
                  View Map
                </span>
                <div className="absolute inset-0 rounded-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Province list card (always show all cities available) */}
        <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[28px] p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
            {provincesOrdered.map((prov) => (
              <div key={prov} className="relative">
                <div className="text-[#263D5D] font-bold mb-1 text-[15px]">
                  {prov} Province
                </div>
                <ul className="list-disc ml-5 space-y-1.5">
                  {grouped[prov].map((d) => {
                    const isSelected = d.name === selected.name;
                    return (
                      <li key={d.name}>
                        <button
                          onClick={() => {
                            setSelected(d);
                            setZoom(10);
                          }}
                          className={[
                            "text-left text-[14px] font-poppins transition-transform",
                            "hover:underline hover:scale-[1.02]",
                            isSelected
                              ? "text-cyan-700 font-semibold"
                              : "text-[#263D5D]",
                          ].join(" ")}
                        >
                          {/*  */}
                          {d.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* View More button (same design, routes to another page) */}
          <button
            onClick={() => navigate("/browse-more")}
            className="flex justify-end mt-12"
            aria-label="View More"
          >
            <div className="relative overflow-hidden flex items-center gap-2 bg-[#263D5D] hover:bg-[#303435] text-white rounded-2xl px-4 py-2 shadow-lg border border-white/20 hover:scale-105 transition group">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-black">
                <FaChevronRight />
              </span>
              <span className="font-semibold tracking-wide font-poppins">
                View More
              </span>
              <div className="absolute inset-0 rounded-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </button>
        </div>
      </div>

      <style>
        {`
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
        `}
      </style>
    </div>
  );
};

export default FindCity;
