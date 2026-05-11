import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Search, Heart, ShoppingCart, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { useGetProductByIdQuery } from '../services/productApi';

const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>(); 
    const dispatch = useDispatch();
    
    // API Call
    const { data: product, isLoading, error } = useGetProductByIdQuery(id as string);

    // State Management
    const [mainImage, setMainImage] = useState('');
    const [imagesArray, setImagesArray] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Drag Logic variables
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Jab product fetch ho jaye, toh images set karo
    useEffect(() => {
        if (product && product.img) {
            const imgs = product.img.split(','); // Cloudinary urls array
            setImagesArray(imgs);
            setMainImage(imgs[0] || ''); 
        } else if (product) {
            // Agar galti se image upload na hui ho toh crash se bachane ke liye
            setImagesArray(['https://via.placeholder.com/400?text=No+Image']);
            setMainImage('https://via.placeholder.com/400?text=No+Image');
        }
    }, [product]);

    // Scroll Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleWheel = (e: React.WheelEvent) => {
        if (scrollRef.current) scrollRef.current.scrollLeft += e.deltaY;
    };

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            ...product,
            id: product.id!,
            price: Number(product.discounted_price || product.price),
            img: imagesArray[0] || '' 
        }));
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>;
    if (error || !product) return <div className="text-center py-20 text-red-500 font-bold text-xl">Product Not Found!</div>;

    const currentPrice = Number(product.discounted_price || product.price).toFixed(2);
    const originalPrice = Number(product.price).toFixed(2);
    
    // Safely handling both category name formats
    const displayCategory = (product as any).categoryName || product.category_name || 'Uncategorized';
    const discountPercent = product.discount_percentage || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans flex flex-col lg:flex-row gap-10">
            
            {/* MAIN CONTENT (Product Details) */}
            <div className="w-full lg:w-3/4 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

                    {/* Image Gallery */}
                    <div className="flex flex-col w-full overflow-hidden">
                        <div className="border border-gray-200 rounded-2xl p-4 relative flex items-center justify-center h-[300px] sm:h-[400px] mb-4 bg-[#f8f9fa] hover:border-green-300 transition-colors group overflow-hidden w-full">
                            {discountPercent > 0 && (
                                <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-br-2xl z-20">
                                    {discountPercent}% OFF
                                </span>
                            )}
                            <Search className="absolute top-4 right-4 text-gray-400 group-hover:text-green-500 transition-colors z-10" size={20} />
                            <img src={mainImage} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out" />
                        </div>

                        {/* Thumbnails */}
                        {imagesArray.length > 1 && (
                            <div 
                                ref={scrollRef}
                                onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onWheel={handleWheel}
                                className={`flex gap-4 overflow-x-auto pb-4 w-full custom-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                {imagesArray.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => !isDragging && setMainImage(thumb)}
                                        className={`group border-2 rounded-xl p-2 h-24 w-24 flex-shrink-0 flex items-center justify-center transition-all bg-[#f8f9fa] overflow-hidden ${
                                            mainImage === thumb ? 'border-green-500 shadow-sm' : 'border-gray-200 hover:border-green-300'
                                        }`}
                                    >
                                        <img src={thumb} alt={`Thumb ${idx}`} draggable="false" className="max-h-full max-w-full object-contain mix-blend-multiply pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Setup */}
                    <div className="flex flex-col">
                        <span className="text-sm text-green-500 font-bold mb-2">{displayCategory}</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#253D4E] leading-tight mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating || 0) ? 0 : 2} className={i >= Math.floor(product.rating || 0) ? "text-gray-300" : ""} />)}
                            </div>
                            <span className="text-sm text-gray-400 font-medium">({product.rating || 0} rating)</span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl sm:text-5xl font-bold text-green-500">${currentPrice}</span>
                            {(product.discounted_price && product.discounted_price < product.price) || product.oldPrice ? (
                                <div className="flex flex-col justify-center">
                                    <span className="text-xl font-bold text-gray-400 line-through">${originalPrice}</span>
                                </div>
                            ) : null}
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {product.description || "No description available for this product."}
                        </p>

                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center gap-4 mb-8 flex-wrap mt-auto">
                            <div className="border border-green-500 rounded-lg flex items-center justify-between w-24 h-12 px-3 bg-white">
                                <span className="text-lg font-bold text-green-500">{quantity}</span>
                                <div className="flex flex-col text-green-500">
                                    <ChevronUp size={16} className="cursor-pointer hover:text-green-700" onClick={() => setQuantity(q => q + 1)} />
                                    <ChevronDown size={16} className="cursor-pointer hover:text-green-700" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} />
                                </div>
                            </div>

                            <button onClick={handleAddToCart} className="bg-green-500 hover:bg-green-600 text-white font-bold h-12 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm flex-1 sm:flex-none justify-center">
                                <ShoppingCart size={18} /> Add to cart
                            </button>

                            <button className="border border-gray-200 bg-white h-12 w-12 rounded-lg flex items-center justify-center text-gray-500 hover:text-green-500 hover:border-green-200 transition-colors shadow-sm flex-shrink-0">
                                <Heart size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm border-t border-gray-100 pt-6">
                            <p className="text-gray-500">Brand: <span className="text-green-500 font-medium">{product.brand}</span></p>
                            <p className="text-gray-500">SKU: <span className="text-green-500 font-medium">{product.sku || 'N/A'}</span></p>
                            <p className="text-gray-500">Stock: <span className="text-green-500 font-medium">{product.stockCount} Items In Stock</span></p>
                        </div>
                    </div>
                </div>

                {/* Tabs Section - Description */}
                <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm overflow-hidden mt-8">
                    <h2 className="text-xl font-bold text-[#253D4E] mb-4 border-b pb-4">Description</h2>
                    <p className="text-gray-600 leading-loose whitespace-pre-wrap">{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;