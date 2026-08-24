// src/pages/BlogsPage.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Clock, Tag, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const BlogsPage = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeTag, setActiveTag] = useState("");
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [blogHero, setBlogHero] = useState(null);

    useEffect(() => {
        fetchBlogHero();
        fetchBlogs();
        fetchFilters();
    }, [searchTerm, activeCategory, activeTag]);

    const fetchBlogHero = async () => {
        try {
            const response = await fetch('http://187.127.219.43:3000/api/blogs');
            const data = await response.json();
            if (data.success && data.data?.blogHero) {
                setBlogHero(data.data.blogHero);
            }
        } catch (error) {
            console.error('Error fetching blog hero:', error);
        }
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            let url = 'http://187.127.219.43:3000/api/blogs/all?';
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (activeCategory !== 'All') params.append('category', activeCategory);
            if (activeTag) params.append('tag', activeTag);
            url += params.toString();

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setBlogs(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            const [categoriesRes, tagsRes] = await Promise.all([
                fetch('http://187.127.219.43:3000/api/blogs/categories'),
                fetch('http://187.127.219.43:3000/api/blogs/tags')
            ]);
            const categoriesData = await categoriesRes.json();
            const tagsData = await tagsRes.json();

            if (categoriesData.success) setCategories(categoriesData.data);
            if (tagsData.success) setTags(tagsData.data);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const featuredBlog = blogs.find(blog => blog.isFeatured);
    const regularBlogs = blogs.filter(blog => !blog.isFeatured);

    const handleBlogClick = (slug) => {
        navigate(`/blog/${slug}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const allCategories = ["All", ...categories];

    return (
        <>
            <Navbar />
            <main className="bg-blue-50">
                {/* Hero Section - Dynamic from API */}
                <div className="relative overflow-hidden text-white min-h-[650px] flex items-center justify-center">

                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={
                                blogHero?.image ||
                                "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            }
                            alt="Blog Hero"
                            className="w-full h-full object-cover object-center scale-105"
                        />
                    </div>

                    {/* Main Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,35,86,0.92)_0%,rgba(30,58,138,0.82)_50%,rgba(14,165,233,0.75)_100%)]"></div>

                    {/* Bottom Dark Fade */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,#0f2356_0%,transparent_60%)]"></div>

                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />

                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-sky-500/20 rounded-full blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">

                        {/* Tag */}
                        <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10">

                            <div className="w-2 h-2 rounded-full bg-sky-400"></div>

                            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-sky-200">
                                {blogHero?.tag || "Knowledge Hub"}
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.05] tracking-[-0.03em]">

                            <span className="bg-gradient-to-r from-white via-blue-100 to-sky-300 bg-clip-text text-transparent">
                                {blogHero?.title || "Insights & Innovations"}
                            </span>

                        </h1>

                        {/* Description */}
                        <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-white/75 leading-relaxed">

                            {blogHero?.description ||
                                "Expert perspectives on laboratory technology, industry trends, and scientific breakthroughs."}

                        </p>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-6 py-16 lg:py-20">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setActiveTag('');
                                    }}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category && !activeTag
                                            ? "bg-[#0f2356] text-white shadow-lg shadow-blue-900/20"
                                            : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f2356] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>



                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Main Content - Blog Posts */}
                        <div className="lg:col-span-2 space-y-10">
                            {loading ? (
                                <div className="text-center py-16">
                                    <Loader2 size={48} className="mx-auto text-[#0f2356] animate-spin mb-4" />
                                    <p className="text-gray-500">Loading articles...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Featured Blog - Premium Card */}
                                    {featuredBlog && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => handleBlogClick(featuredBlog.slug)}
                                            className="group cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                                        >
                                            <div className="relative h-80 overflow-hidden">
                                                <img
                                                    src={featuredBlog.mainImage}
                                                    alt={featuredBlog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#0f2356] text-xs font-semibold rounded-full">
                                                        Featured
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                                    <span className="text-[#2563eb] font-semibold">{featuredBlog.category}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(featuredBlog.date)}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock size={12} />{featuredBlog.duration}</span>
                                                </div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#0f2356] transition-colors">
                                                    {featuredBlog.title}
                                                </h2>
                                                <p className="text-gray-600 leading-relaxed">{featuredBlog.shortDescription}</p>
                                                <div className="mt-6 flex items-center text-[#0f2356] font-medium">
                                                    Read Article
                                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Blog Grid */}
                                    {regularBlogs.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {regularBlogs.map((blog, index) => (
                                                <motion.div
                                                    key={blog._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    onClick={() => handleBlogClick(blog.slug)}
                                                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                                >
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={blog.mainImage}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                            <span className="text-[#2563eb] font-semibold">{blog.category}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1"><Clock size={10} />{blog.duration}</span>
                                                        </div>
                                                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#0f2356] transition-colors line-clamp-2">
                                                            {blog.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm line-clamp-2">{blog.shortDescription}</p>
                                                        <div className="mt-4 flex justify-between items-center">
                                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} />{formatDate(blog.date)}</span>
                                                            <span className="text-[#0f2356] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Read more →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        // <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                                        //     <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                                        //     <p className="text-gray-500">No articles found matching your criteria.</p>
                                        // </div>
                                        <div></div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Categories Card */}
                            {categories.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Tag size={18} className="text-[#0f2356]" />
                                        Categories
                                    </h3>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setActiveCategory(cat);
                                                    setActiveTag('');
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat && !activeTag
                                                        ? "bg-[#0f2356]/10 text-[#0f2356] font-medium"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Tags Card */}
                            {tags.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    setActiveTag(tag === activeTag ? '' : tag);
                                                    setActiveCategory('All');
                                                }}
                                                className={`px-3 py-1 text-xs rounded-full transition-all ${activeTag === tag
                                                        ? "bg-[#0f2356] text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Posts Card */}
                            {blogs.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock size={18} className="text-[#0f2356]" />
                                        Recent Posts
                                    </h3>
                                    <div className="space-y-4">
                                        {blogs.slice(0, 4).map((blog) => (
                                            <div
                                                key={blog._id}
                                                onClick={() => handleBlogClick(blog.slug)}
                                                className="flex gap-3 cursor-pointer group"
                                            >
                                                <img
                                                    src={blog.mainImage}
                                                    alt={blog.title}
                                                    className="w-16 h-16 rounded-lg object-cover group-hover:opacity-90 transition"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0f2356] transition-colors line-clamp-2">
                                                        {blog.title}
                                                    </p>
                                                    <span className="text-xs text-gray-400">{formatDate(blog.date)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {[...Array(pagination.pages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setPagination(prev => ({ ...prev, page: i + 1 }));
                                        fetchBlogs();
                                    }}
                                    className={`w-10 h-10 rounded-lg transition-all ${pagination.page === i + 1
                                            ? "bg-[#0f2356] text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BlogsPage;