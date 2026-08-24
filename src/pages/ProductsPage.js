import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Grid, List, ChevronRight, Sparkles,
  X, Filter, ArrowRight, Star, Phone, CheckCircle,
  Award, Truck, Shield, Clock, Package as PackageIcon,
  TrendingUp, Zap, Heart, Eye, SlidersHorizontal,
  ChevronDown, BookOpen, Beaker, Microscope, FlaskConical,
  Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fallbackImage from '../assets/fallbackimage.png';
import { Helmet } from "react-helmet";

const API_BASE = "https://smartlabtechbackend-p5h6.onrender.com";

const stats = [
  { value: "500+", label: "Products", icon: PackageIcon },
  { value: "25+", label: "Global Brands", icon: Award },
  { value: "10k+", label: "Happy Clients", icon: TrendingUp },
  { value: "24/7", label: "Support", icon: Clock },
];

const features = [
  { icon: Shield, title: "Certified", desc: "ISO & GMP Compliant" },
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹50k" },
  { icon: Award, title: "Warranty", desc: "Up to 3 years" },
  { icon: CheckCircle, title: "Installation", desc: "Free on-site setup" },
];

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

/* ─── Helpers ─── */
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// const fallbackImage = "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2";

/* ─── Product Card Component ─── */
const ProductCard = ({ product, viewMode, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = imageError ? fallbackImage : (getImageUrl(product.mainImage) || fallbackImage);

  // Build link from _id
  const productLink = `/product/${product._id}`;

  if (viewMode === "list") {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: index * 0.02 }}
        onClick={() => navigate(productLink)}
        className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative sm:w-64 h-44 sm:h-auto overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-sky-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
            <img
              src={imageUrl}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/80 to-sky-600/80 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
              <button className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full text-sm flex items-center gap-2">
                View Details <Eye size={14} />
              </button>
            </div>

            {product.isFeatured && (
              <div className="absolute top-3 left-3 z-10">
                <div className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-lg">
                  <Sparkles size={10} /> FEATURED
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div
            className="flex-1 p-5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                  {product.brandName || product.brand?.name || "—"}
                </span>
                {product.categoryName && (
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200">
                    {product.categoryName}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                  ))}
                  <span className="text-xs text-slate-500 ml-1">({product.reviews || 0})</span>
                </div>
              </div>
              
            </div>

            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
              {product.name}
            </h3>
            <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.shortDesc}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                  <span className="text-xs text-slate-500">{product.inStock ? 'Ready to Ship' : 'Made to Order'}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5">
                View Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View Card
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.02 }}
      onClick={() => navigate(productLink)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-sky-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/80 to-sky-600/80 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
          <button className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-full text-sm flex items-center gap-2">
            Quick View <Eye size={14} />
          </button>
        </div>

        {product.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-lg">
              <Sparkles size={10} /> FEATURED
            </div>
          </div>
        )}

        

        {!product.inStock && (
          <div className="absolute bottom-3 left-3 z-10 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg">
            Made to Order
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
            {product.brandName || product.brand?.name || "—"}
          </span>
          {product.categoryName && (
            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-semibold rounded-full border border-slate-200">
              {product.categoryName}
            </span>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
            ))}
            <span className="text-[10px] text-slate-400 ml-0.5">({product.reviews || 0})</span>
          </div>
        </div>

        <h3 className="font-serif text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition line-clamp-1">
          {product.name}
        </h3>
        <p className="text-slate-500 text-xs mb-4 line-clamp-2">{product.shortDesc}</p>

        {(product.price || product.discountedPrice) && (
          <div className="flex items-end justify-between">

            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              <span className="text-[10px] text-slate-500">{product.inStock ? 'In Stock' : 'On Order'}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Skeleton Loader ─── */
const SkeletonCard = ({ viewMode }) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col sm:flex-row">
        <div className="sm:w-64 h-44 sm:h-auto bg-slate-200" />
        <div className="flex-1 p-5 space-y-3">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 rounded-lg" />
            <div className="h-6 w-24 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-2/3 bg-slate-100 rounded" />
          <div className="h-8 w-32 bg-slate-200 rounded-lg mt-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
        <div className="h-6 w-28 bg-slate-200 rounded mt-2" />
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedBrand, setSelectedBrand] = useState("Brand");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  /* ─── Fetch Products from API ─── */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products?limit=200`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      // Support both { data: [...] } and { products: [...] } and plain array
      const list = json.data || json.products || (Array.isArray(json) ? json : []);
      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Derive filter options from live data ─── */
  const brands = ["Brand", ...new Set(products.map(p => p.brandName || p.brand?.name).filter(Boolean))];
  const categories = ["Category", ...new Set(products.map(p => p.categoryName || p.category?.name).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const name = product.name?.toLowerCase() || "";
    const brand = (product.brandName || product.brand?.name || "").toLowerCase();
    const desc = (product.shortDesc || "").toLowerCase();
    const category = product.categoryName || product.category?.name || "";

    const matchesSearch = !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      brand.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Category" || category === selectedCategory;
    const matchesBrand = selectedBrand === "Brand" ||
      (product.brandName || product.brand?.name) === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <>

      <Helmet>

        <title>Scientific Instruments & Laboratory Equipment | SmartLabTech</title>

        <meta
          name="description"
          content="Browse SmartLabTech laboratory instruments, scientific equipment, analytical machines, testing systems, and research solutions for healthcare, pharma, education, and industrial laboratories."
        />

        <meta
          name="keywords"
          content="laboratory equipment, scientific instruments, analytical instruments, testing equipment, lab machines, research instruments"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Scientific Instruments & Laboratory Equipment | SmartLabTech" />

        <meta
          property="og:description"
          content="Explore premium scientific instruments and laboratory equipment solutions from SmartLabTech."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content="/logo.png" />

        <link rel="canonical" href="https://smartlabtech.com/products" />

      </Helmet>

      <Navbar />
      <div className="bg-blue-50 font-sans">

        {/* Header Section */}
        <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-100/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-sky-100/15 rounded-full" />
          </div>

          <div className="relative z-10 max-w-8xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center">
                      <Beaker size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">Laboratory Equipment</span>
                  </div>
                  <div className="w-px h-4 bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <Microscope size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {loading ? "Loading..." : `${products.length}+ Products`}
                    </span>
                  </div>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                  Scientific <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Instruments</span>
                </h1>
                <p className="text-slate-500 text-sm sm:text-base max-w-xl">
                  Discover precision equipment from the world's most trusted manufacturers
                </p>
              </motion.div>


            </div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by product name, brand, or application..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-sm"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition ${viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition ${viewMode === "list"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="sm:hidden mt-3 overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm"
                    >
                      {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm"
                    >
                      {brands.map(brand => <option key={brand}>{brand}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        Grid View
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        List View
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* All Products Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">All Products</h2>
                <p className="text-slate-500 text-sm">
                  {loading ? "Loading products..." : `${filteredProducts.length} items available`}
                </p>
              </div>
              <button
                onClick={fetchProducts}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition"
                title="Refresh"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle size={28} className="text-red-400" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-slate-800 mb-2">Failed to load products</h3>
                <p className="text-slate-500 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "space-y-4"
              }>
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-serif text-xl font-semibold text-slate-800 mb-2">No products found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("Category"); setSelectedBrand("Brand"); }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Product Grid / List */}
            {!loading && !error && filteredProducts.length > 0 && (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className={viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  : "space-y-4"
                }
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product._id || index} product={product} viewMode={viewMode} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </section>



        {/* Back to Top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40"
            >
              <ArrowRight size={18} className="sm:w-5 sm:h-5 rotate-[-90deg]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;