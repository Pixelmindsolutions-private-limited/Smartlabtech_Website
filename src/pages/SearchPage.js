import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronRight, Star, Heart, Grid, List,
  X, ArrowRight, TrendingUp, Sparkles,
  Zap, History, Clock, Eye, SlidersHorizontal, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// API Base URL
const API_BASE_URL = 'http://187.127.219.43:3000/api';

// Premium Search Bar Component
const PremiumSearchBar = ({ initialQuery, onSearch, onClear }) => {
  const [searchInput, setSearchInput] = useState(initialQuery || '');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('smartlabtech_search_history');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  const saveToRecent = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('smartlabtech_search_history', JSON.stringify(updated));
  };

  useEffect(() => {
    setSearchInput(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      saveToRecent(searchInput.trim());
      onSearch(searchInput.trim());
      setShowRecent(false);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    onClear();
    inputRef.current?.focus();
  };

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      saveToRecent(searchInput.trim());
      onSearch(searchInput.trim());
      setShowRecent(false);
    }
  };

  const handleRecentClick = (term) => {
    setSearchInput(term);
    saveToRecent(term);
    onSearch(term);
    setShowRecent(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('smartlabtech_search_history');
  };

  const popularSearches = [
    { term: 'Analytical Balance', icon: '⚖️' },
    { term: 'Chromatography', icon: '🧪' },
    { term: 'Centrifuge', icon: '🌀' },
    { term: 'Incubator', icon: '🌡️' },
    { term: 'Microscope', icon: '🔬' },
    { term: 'pH Meter', icon: '📊' },
  ];

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-4xl mx-auto">
      <div className={`relative rounded-3xl transition-all duration-500 ${isFocused
        ? 'shadow-2xl shadow-blue-500/20'
        : 'shadow-lg shadow-slate-200/50'
        }`}>

        <div className={`absolute inset-0 rounded-3xl transition-all duration-500 overflow-hidden ${isFocused ? 'opacity-100' : 'opacity-0'
          }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-sky-600/80" />
        </div>

        <div className={`absolute inset-0 bg-white rounded-3xl transition-all duration-500 ${isFocused ? 'opacity-0' : 'opacity-100'
          }`} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 p-2 sm:p-3">
            <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isFocused
              ? 'bg-white/20 text-white'
              : 'bg-gradient-to-br from-blue-50 to-sky-50 text-blue-600'
              }`}>
              <Search size={20} className="sm:w-5 sm:h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products, brands, or categories..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === '') {
                  onClear();
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                setShowRecent(true);
              }}
              onBlur={() => setIsFocused(false)}
              className={`flex-1 bg-transparent border-none text-base sm:text-lg py-2 px-1 outline-none placeholder:text-slate-400 transition-colors duration-300 ${isFocused
                ? 'text-white placeholder:text-white/60'
                : 'text-slate-800'
                }`}
            />

            {searchInput && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${isFocused
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                aria-label="Clear search"
              >
                <X size={16} className="sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Searches Dropdown */}
      <AnimatePresence>
        {showRecent && (recentSearches.length > 0 || popularSearches.length > 0) && !searchInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50"
          >
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentClick(search)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                  >
                    <History size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-700 flex-1">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Button */}
      <AnimatePresence>
        {isFocused && searchInput && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleSearchClick}
            className="sm:hidden fixed bottom-6 left-4 right-4 z-50 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-xl shadow-xl flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Search "{searchInput.slice(0, 20)}{searchInput.length > 20 ? '...' : ''}"
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Product Card Component - Updated to match API response structure
const ProductCard = ({ product, viewMode }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2";

  const isBlog = product.type === "blog";

  // Handle different field names from API
  const title = product.title || product.name || "";
  const description = product.description || product.shortDesc || "";
  const image = product.image || product.mainImage || fallbackImage;

  // Blog specific fields
  const badgeText = isBlog ? (product.author || "Blog") : (product.brand || "Brand");
  const category = product.category || "Uncategorized";

  // Product link
  const productLink = isBlog ? `/blog/${product.slug}` : `/product/${product.id || product.id}`;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate(productLink)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-64 h-44 sm:h-auto overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
            <img
              src={imageError ? fallbackImage : image}
              alt={title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/80 to-sky-600/80 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full text-sm">
                View Details
              </button>
            </div>
            {product.isFeatured && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                <Sparkles size={10} /> FEATURED
              </div>
            )}
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                  {badgeText}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                  ))}
                  <span className="text-xs text-slate-500">({product.reviews || 0})</span>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${isBlog ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>
                {isBlog ? "BLOG" : "PRODUCT"}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition line-clamp-1">
              {title}
            </h3>
            <p className="text-slate-500 text-sm mb-3 line-clamp-2">{description?.substring(0, 100)}</p>
            <div className="flex items-center justify-between">
              {!isBlog && product.price && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-blue-600">${product.price?.toLocaleString()}</span>
                </div>
              )}
              {isBlog && product.date && (
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{new Date(product.date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${!isBlog && product.inStock !== false ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="text-xs text-slate-500">{!isBlog && product.inStock !== false ? 'In Stock' : 'Available'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(productLink)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-sky-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />

      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
        <img
          src={imageError ? fallbackImage : image}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/80 to-sky-600/80 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-full text-sm flex items-center gap-2">
            Quick View <Eye size={14} />
          </button>
        </div>
        {product.isFeatured && (
          <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
            <Sparkles size={10} /> FEATURED
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
            {badgeText}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
            ))}
            <span className="text-[10px] text-slate-400 ml-0.5">({product.reviews || 0})</span>
          </div>
        </div>
        <div className="mb-2">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${isBlog ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>
            {isBlog ? "BLOG" : "PRODUCT"}
          </span>
        </div>
        <h3 className="font-serif text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition line-clamp-1">
          {title}
        </h3>
        <p className="text-slate-500 text-xs mb-4 line-clamp-2">{description?.substring(0, 80)}</p>

        <div className="flex items-end justify-between">

          {isBlog && product.date && (
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-500">{new Date(product.date).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${!isBlog && product.inStock !== false ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
            <span className="text-[10px] text-slate-500">{!isBlog && product.inStock !== false ? 'In Stock' : 'Available'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Loading Component
const LoadingState = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-slate-500">Loading products...</p>
    </div>
  </div>
);

// No Results Component
const NoResults = ({ query, onClear }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="font-serif text-2xl font-semibold text-slate-800 mb-2">
        No results found for "{query}"
      </h3>
      <p className="text-slate-500 mb-6">Try adjusting your search or browse our categories</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onClear}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          Clear Search
        </button>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition"
        >
          Browse All Products
        </button>
      </div>
    </div>
  );
};

// Main Search Results Component
export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch search results based on query
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setFilteredResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        const url = `${API_BASE_URL}/products/search/all?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          const resultsData = data.data || [];
          setResults(resultsData);
          setFilteredResults(resultsData);

          // Extract unique categories
          const uniqueCategories = [
            "All",
            ...new Set(
              resultsData
                .map(item => item.category || "Other")
                .filter(Boolean)
            ),
          ];
          setCategories(uniqueCategories);
        } else {
          setResults([]);
          setFilteredResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (newQuery) => {
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  // Apply category and type filters
  const displayResults = filteredResults.filter(item => {
    const itemCategory = item.category || "Other";
    const matchesCategory = selectedCategory === 'All' || itemCategory === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesCategory && matchesType;
  });

  // Sort results
  const sortedResults = [...displayResults].sort((a, b) => {
    if (sortBy === "title-asc")
      return (a.title || "").localeCompare(b.title || "");
    if (sortBy === "title-desc")
      return (b.title || "").localeCompare(a.title || "");
    if (sortBy === "rating")
      return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price-asc" && a.type === 'product' && b.type === 'product')
      return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-desc" && a.type === 'product' && b.type === 'product')
      return (b.price || 0) - (a.price || 0);
    // relevance - default order from API
    return 0;
  });

  // Stats for display
  const productCount = results.filter(r => r.type === 'product').length;
  const blogCount = results.filter(r => r.type === 'blog').length;

  return (
    <>
      <Navbar />
      <div className="bg-blue-50 font-sans min-h-screen">
        {/* Hero Section with Background Image and Blue Overlay */}
        <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"
              alt="Laboratory Equipment Background"
              className="w-full h-full object-cover object-center"
            />
            {/* Blue Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,35,86,0.88)_0%,rgba(30,58,138,0.72)_50%,rgba(14,165,233,0.82)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,#0f2356_0%,transparent_55%)]" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
                backgroundRepeat: 'repeat'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-8xl mx-auto">
            <div className="text-center mb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30"
              >
                <Zap size={12} className="text-amber-300" />
                <span className="text-xs font-semibold text-white tracking-wide">SMART SEARCH</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
              >
                Find Your Perfect{' '}
                <span className="bg-gradient-to-r from-amber-300 to-white bg-clip-text text-transparent">
                  Laboratory Equipment
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 text-sm sm:text-base"
              >
                Search across premium products from world-renowned brands
              </motion.p>
            </div>

            {/* Premium Search Bar */}
            <PremiumSearchBar
              initialQuery={query}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />

            {/* Results Count */}
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center"
              >
                <p className="text-white/80 text-sm">
                  {!loading && (
                    <>
                      Found <span className="font-bold text-white">{results.length}</span> results for "<span className="text-white">{query}</span>"
                      {results.length > 0 && (
                        <span className="ml-2 text-xs">
                          ({productCount} product{productCount !== 1 ? 's' : ''}, {blogCount} blog{blogCount !== 1 ? 's' : ''})
                        </span>
                      )}
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Filters Bar */}
        {!loading && results.length > 0 && (
          <section className="top-[106px] sm:top-[114px] lg:top-[122px] z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
            <div className="max-w-8xl mx-auto">
              <div className="flex flex-wrap items-center gap-3">
                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="product">Products</option>
                  <option value="blog">Blogs</option>
                </select>

                {/* Category Filter */}
                {categories.length > 1 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                )}

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                {/* Clear Filters Button */}
                {(selectedCategory !== 'All' || selectedType !== 'All') && (
                  <button
                    onClick={() => { setSelectedCategory('All'); setSelectedType('All'); }}
                    className="px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                  >
                    <X size={14} /> Clear Filters
                  </button>
                )}

                {/* View Mode Toggle */}
                <div className="flex gap-1 ml-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto">
            {loading ? (
              <LoadingState />
            ) : !hasSearched ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="font-serif text-2xl font-semibold text-slate-800 mb-2">
                  Start Your Search
                </h3>
                <p className="text-slate-500">Enter a keyword to find products, blogs, and more...</p>
              </div>
            ) : query && sortedResults.length === 0 ? (
              <NoResults query={query} onClear={handleClearSearch} />
            ) : sortedResults.length > 0 ? (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-slate-500">
                  Showing {sortedResults.length} of {filteredResults.length} results
                </div>
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  : "space-y-4"
                }>
                  {sortedResults.map((item, index) => (
                    <ProductCard
                      key={item.id || item._id || item.slug || index}
                      product={item}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>

        {/* Related Categories */}
        {!loading && results.length > 0 && categories.length > 1 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-8xl mx-auto">
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">Browse Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c !== 'All').slice(0, 8).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4 py-2 bg-white text-slate-700 text-sm rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40"
            >
              <ArrowRight size={20} className="rotate-[-90deg]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}