// src/components/BrandMarquee.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BrandMarquee() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://187.127.219.43:3000/api/brands')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setBrands(data.data.filter(b => b.isActive));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return null;
    if (brands.length === 0) return null;

    const duplicatedBrands = [...brands, ...brands, ...brands];

    return (
        <div className="bg-blue-50 py-12">
            <div className="max-w-9xl mx-auto px-4 sm:px-8 lg:px-20">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-px bg-blue-600" />
                        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">Our Partners</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Trusted Principals</h2>
                </div>
                <div className="relative overflow-hidden">
                    <motion.div
                        className="flex items-center"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 40, ease: "linear", repeat: Infinity, repeatType: "loop" }}
                    >
                        {duplicatedBrands.map((brand, idx) => (
                            <a
                                key={`${brand._id}-${idx}`}
                                href={brand.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 w-36 h-24 mx-6 bg-transparent rounded-xl flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <img
                                    src={brand.logo?.replace('localhost:5000', 'smartlabtechbackend-p5h6.onrender.com')}
                                    alt={brand.name}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}