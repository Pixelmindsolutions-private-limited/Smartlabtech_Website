import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronRight, Star, Globe, ExternalLink, Building2,
  Package, Tag, Search, X, ArrowUp, AlertCircle, RefreshCw, Sparkles,
  Layers, ShieldCheck
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FALLBACK_IMAGE from "../assets/fallbackimage.png";

const API_BASE = "https://api.smartlabtech.com";
const ADMIN_PRODUCTS_URL = `${API_BASE}/api/products/admin`;

/* ─── Helpers ─── */
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// "schmidt-haensch" -> "schmidt haensch" so it can be matched loosely
// against the real brand name coming back from the API.
const normalize = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .replace(/[-_+]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/* ─── Font Import (kept consistent with ProductDetails) ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    .font-serif { font-family: 'Cormorant Garamond', serif; }
    .font-sans  { font-family: 'Plus Jakarta Sans', sans-serif; }

    .gradient-text {
      background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-card-gradient {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    .float-anim { animation: float 4s ease-in-out infinite; }

    .chip-underline { position: relative; }
    .chip-underline::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(135deg, #1e3a8a, #0ea5e9);
      border-radius: 2px;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    .chip-underline.active::after { transform: scaleX(1); }

    .prod-card:hover .prod-img { transform: scale(1.08); }
    .prod-img { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  `}</style>
);

/* ─── Product Card ─── */
const ProductCard = ({ item, index, navigate }) => {
  const itemImage = getImageUrl(item.mainImage) || FALLBACK_IMAGE;
  const itemCategory = item.categoryName || item.category?.name || "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 8) * 0.06 }}
      onClick={() => navigate(`/product/${item._id}`)}
      className="prod-card group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer h-full"
    >
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={itemImage}
          alt={item.name}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          className="prod-img w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-slate-700 shadow-sm">
            {itemCategory}
          </span>
        </div>
        {!item.inStock && (
          <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-yellow-500 px-2 py-0.5 rounded-full">
            MTO
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 mb-1.5 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
          {item.name}
        </h4>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
          {item.shortDesc}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, s) => (
              <Star
                key={s}
                size={11}
                className={s < Math.floor(item.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}
              />
            ))}
            <span className="text-slate-400 text-xs ml-0.5">{item.rating || "—"}</span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.inStock ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {item.inStock ? "In Stock" : "Made to Order"}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${item._id}`); }}
          className="w-full py-2 bg-gradient-to-r from-blue-700 to-sky-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition flex items-center justify-center gap-1"
        >
          View Details <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
const PrincipleDetails = () => {
  const { brandParam } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ADMIN_PRODUCTS_URL);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const list = json.data || json.products || (Array.isArray(json) ? json : []);
      setAllProducts(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to load brand products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    fetchProducts();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [brandParam]);

  /* ─── Filter products belonging to this brand ─── */
  const targetBrand = normalize(decodeURIComponent(brandParam || ""));

  const brandProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const name = p.brandName || p.brand?.name || "";
      return normalize(name) === targetBrand;
    });
  }, [allProducts, targetBrand]);

  // Brand metadata — pulled from whichever matching product has the fullest brand object
  const brandInfo = useMemo(() => {
    const withBrandObj = brandProducts.find((p) => p.brand && p.brand.name);
    if (withBrandObj) return withBrandObj.brand;
    if (brandProducts.length > 0) {
      return { name: brandProducts[0].brandName || "—" };
    }
    return null;
  }, [brandProducts]);

  const brandDisplayName = brandInfo?.name || brandProducts[0]?.brandName || decodeURIComponent(brandParam || "");

  const categories = useMemo(() => {
    const set = new Set(
      brandProducts.map((p) => p.categoryName || p.category?.name).filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [brandProducts]);

  const visibleProducts = useMemo(() => {
    return brandProducts.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || (p.categoryName || p.category?.name) === activeCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        p.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        p.shortDesc?.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [brandProducts, activeCategory, searchTerm]);

  const inStockCount = brandProducts.filter((p) => p.inStock).length;

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full border-2 border-blue-200 border-t-blue-600"
            />
            <p className="text-slate-600 font-sans text-base sm:text-lg">Loading brand details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Error / Not Found State ─── */
  if (error || !brandInfo || brandProducts.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">
              {error ? "Something Went Wrong" : "Brand Not Found"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {error || `We couldn't find any products for "${decodeURIComponent(brandParam || "")}".`}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchProducts}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                <RefreshCw size={14} /> Try Again
              </button>
              <button
                onClick={() => navigate("/products")}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <FontLink />
      <Navbar />
      <div className="bg-blue-50 font-sans min-h-screen">

        {/* ── Hero / Brand Profile ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm mb-6 text-slate-500 flex-wrap">
              <button onClick={() => navigate("/")} className="hover:text-blue-600 transition">Home</button>
              <ChevronRight size={12} />
              <button onClick={() => navigate("/products")} className="hover:text-blue-600 transition">Products</button>
              <ChevronRight size={12} />
              <span className="text-slate-700">{brandDisplayName}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="brand-card-gradient rounded-2xl sm:rounded-3xl border border-blue-100 overflow-hidden"
            >
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
                  <div className="flex items-start gap-4 sm:gap-5 mb-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-blue-200 flex items-center justify-center shadow-sm flex-shrink-0 float-anim overflow-hidden">
                      {brandInfo?.logo ? (
                        <img
                          src={getImageUrl(brandInfo.logo)}
                          alt={brandDisplayName}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                        />
                      ) : null}
                      <span
                        className="font-serif text-2xl sm:text-3xl font-bold gradient-text"
                        style={{ display: brandInfo?.logo ? "none" : "flex" }}
                      >
                        {brandDisplayName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-2">
                        <Building2 size={12} className="text-blue-600" />
                        <span className="text-blue-700 text-[11px] font-semibold tracking-wider uppercase">Brand Profile</span>
                      </div>
                      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        <span className="gradient-text">{brandDisplayName}</span>
                      </h1>
                    </div>
                  </div>

                  {brandInfo?.description && (
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                      {brandInfo.description}
                    </p>
                  )}

                  {brandInfo?.website && (
                    <a
                      href={brandInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition"
                    >
                      <Globe size={14} />Visit Brand Website<ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="lg:col-span-2 bg-white/60 border-t lg:border-t-0 lg:border-l border-blue-100 p-6 sm:p-8 grid grid-cols-3 lg:grid-cols-1 lg:divide-y divide-blue-100">
                  <div className="lg:pb-4">
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">{brandProducts.length}</p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                      <Package size={13} className="text-blue-600" />Total Products
                    </p>
                  </div>
                  <div className="lg:py-4">
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">{categories.length - 1}</p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                      <Layers size={13} className="text-blue-600" />Categories
                    </p>
                  </div>
                  <div className="lg:pt-4">
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">{inStockCount}</p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-blue-600" />In Stock
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Products Section ── */}
        <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-10"
            >
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                All <span className="gradient-text">{brandDisplayName}</span> Products
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Browse the full {brandDisplayName} range available from Smart Labtech
              </p>
            </motion.div>

            {/* Search + Category Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 lg:flex-wrap lg:overflow-visible">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`chip-underline flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full border transition-all ${
                        isActive
                          ? "text-blue-700 bg-white border-blue-200 shadow-sm active"
                          : "text-slate-500 bg-white/50 border-slate-200 hover:text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Tag size={13} />{cat}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-72 flex-shrink-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${brandDisplayName} products...`}
                  className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              {visibleProducts.length > 0 ? (
                <motion.div
                  key={activeCategory + searchTerm}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                >
                  {visibleProducts.map((item, i) => (
                    <ProductCard key={item._id} item={item} index={i} navigate={navigate} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Sparkles size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm sm:text-base">
                    No products match your filters. Try a different category or search term.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Back to Top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default PrincipleDetails;