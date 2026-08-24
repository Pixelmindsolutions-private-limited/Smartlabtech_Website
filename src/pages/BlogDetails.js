// src/pages/BlogDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, Clock, Tag, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link2, Loader2, AlertCircle } from "lucide-react";
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Helmet } from "react-helmet";


const BlogDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://187.127.219.43:3000/api/blogs/slug/${slug}`);
            const data = await response.json();

            if (data.success && data.data) {
                setBlog(data.data);
                fetchRelatedPosts(data.data.category);
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedPosts = async (category) => {
        try {
            const response = await fetch(`http://187.127.219.43:3000/api/blogs/all?category=${category}&limit=3`);
            const data = await response.json();
            if (data.success) {
                const related = data.data.filter(post => post.slug !== slug).slice(0, 3);
                setRelatedPosts(related);
            }
        } catch (error) {
            console.error('Error fetching related posts:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleShare = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(blog?.title || '');
        let shareLink = '';

        switch (platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            default:
                return;
        }

        window.open(shareLink, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={48} className="mx-auto text-[#0f2356] animate-spin mb-4" />
                        <p className="text-gray-600">Loading article...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-4">
                        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
                        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/blogs')}
                            className="px-6 py-3 bg-[#0f2356] text-white rounded-xl hover:bg-[#1e3a8a] transition-colors"
                        >
                            Back to Blogs
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>

            <Helmet>

                <title>
                    {blog?.seoTitle || `${blog?.title} | SmartLabTech Blog`}
                </title>

                <meta
                    name="description"
                    content={
                        blog?.seoDescription ||
                        blog?.shortDescription ||
                        "Read the latest scientific articles and laboratory insights from SmartLabTech."
                    }
                />

                <meta
                    name="keywords"
                    content={
                        blog?.tags?.join(", ") ||
                        "laboratory blogs, scientific articles, SmartLabTech"
                    }
                />

                <meta
                    name="robots"
                    content="index, follow"
                />

                {/* Open Graph */}
                <meta
                    property="og:title"
                    content={blog?.seoTitle || blog?.title}
                />

                <meta
                    property="og:description"
                    content={
                        blog?.seoDescription ||
                        blog?.shortDescription
                    }
                />

                <meta
                    property="og:type"
                    content="article"
                />

                <meta
                    property="og:url"
                    content={window.location.href}
                />

                <meta
                    property="og:image"
                    content={blog?.bgImage || blog?.mainImage}
                />

                {/* Twitter */}
                <meta
                    name="twitter:card"
                    content="summary_large_image"
                />

                <meta
                    name="twitter:title"
                    content={blog?.seoTitle || blog?.title}
                />

                <meta
                    name="twitter:description"
                    content={
                        blog?.seoDescription ||
                        blog?.shortDescription
                    }
                />

                <meta
                    name="twitter:image"
                    content={blog?.bgImage || blog?.mainImage}
                />

                {/* Canonical */}
                <link
                    rel="canonical"
                    href={`https://smartlabtech.com/blog/${blog?.slug}`}
                />

            </Helmet>

            <Navbar />
            <main className="bg-blue-50">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                    <img
                        src={blog.bgImage || blog.mainImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-12 text-white">
                        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                            <span className="px-3 py-1 bg-[#2563eb] rounded-full text-white font-semibold">
                                {blog.category}
                            </span>
                            <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(blog.date)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock size={14} />{blog.duration}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            {blog.title}
                        </h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
                    {/* Author Info */}
                    <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200">
                        {blog.author?.image ? (
                            <img
                                src={blog.author.image}
                                alt={blog.author.name}
                                className="w-14 h-14 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0f2356] to-[#2563eb] flex items-center justify-center">
                                <User size={24} className="text-white" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-gray-900">{blog.author?.name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-500">{blog.author?.role || 'Contributor'}</p>
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-[#0f2356]">
                        <p className="text-gray-700 italic text-lg">{blog.shortDescription}</p>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        {blog.longDescription?.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Quote Section */}
                    {blog.quote && (
                        <div className="my-10 p-6 bg-gray-100 rounded-xl border-l-4 border-[#0f2356]">
                            <p className="text-lg italic text-gray-700">"{blog.quote}"</p>
                        </div>
                    )}

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="flex flex-wrap justify-between items-center mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm">Share this article:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FaFacebook size={14} />
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FaTwitter size={14} />
                                </button>
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FaLinkedin size={14} />
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center hover:scale-110 transition-transform relative"
                                >
                                    <Link2 size={14} />
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                                            Copied!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/blogs')}
                            className="text-[#0f2356] font-medium hover:underline flex items-center gap-1 mt-4 md:mt-0"
                        >
                            <ArrowLeft size={16} /> Back to all articles
                        </button>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((post) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => navigate(`/blog/${post.slug}`)}
                                        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
                                    >
                                        <img
                                            src={post.mainImage}
                                            alt={post.title}
                                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="p-4">
                                            <span className="text-xs text-[#2563eb] font-semibold">{post.category}</span>
                                            <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">{post.title}</h3>
                                            <span className="text-xs text-gray-400 mt-2 block">{formatDate(post.date)}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


            </main>
            <Footer />
        </>
    );
};

export default BlogDetailsPage;