import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { RootState } from '../store/store';
import { Star, Heart, Loader2, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../features/wishlistSlice';
import { addToCart } from '../features/cartSlice';
import {
    useGetProductByIdQuery,
    useAddReviewMutation,
    useGetProductReviewsQuery
} from '../services/productApi';

const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();

    // 🔥 DYNAMIC LOGIN CHECK
    const token = useSelector((state: any) => state.auth?.token) || localStorage.getItem('token');
    const isLoggedIn = !!token;

    const wishlistItems = useSelector((state: RootState) => state.wishlist?.wishlistItems || []);

    // API Calls
    const { data: product, isLoading, error } = useGetProductByIdQuery(id as string);
    const { data: reviewsData } = useGetProductReviewsQuery(id as string);
    const [submitReview, { isLoading: isReviewSubmitting }] = useAddReviewMutation();

    const reviews = reviewsData?.reviews || [];

    // State Management for Gallery & Zoom
    const [mainImage, setMainImage] = useState('');
    const [imagesArray, setImagesArray] = useState<string[]>([]);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

    // State Management for Reviews
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    const imageContainerRef = useRef<HTMLDivElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);


    const isWishlisted = wishlistItems.some(i => i.id === product?.id); // 🔥 product ke baad '?' zaroor lagayein

    // Image setup on load
    useEffect(() => {
        if (product && product.img) {
            const imgs = product.img.split(',');
            setImagesArray(imgs);
            setMainImage(imgs[0] || '');
        } else if (product) {
            setImagesArray(['https://via.placeholder.com/600?text=No+Image']);
            setMainImage('https://via.placeholder.com/600?text=No+Image');
        }
    }, [product]);

    // Zoom Handler
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;
        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    // Rating Click Handler
    const handleRatingClick = () => {
        if (!isLoggedIn) {
            alert("Please login first to read or write a review!");
            return;
        }
        reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Add to Cart Handler
    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            ...product,
            id: product.id!,
            price: Number(product.discounted_price || product.price),
            img: imagesArray[0] || ''
        }));
    };

    // Review Submit Handler
    const handleReviewSubmit = async () => {
        if (!reviewText.trim()) {
            alert("Review text cannot be empty!");
            return;
        }

        try {
            await submitReview({ product_id: id!, rating, review_text: reviewText }).unwrap();
            alert("Review successfully added!");
            setReviewText('');
            setRating(5);
        } catch (err: any) {
            alert(err.data?.message || "Failed to submit review");
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>;
    if (error || !product) return <div className="text-center py-20 text-red-500 font-bold text-xl">Product Not Found!</div>;

    const currentPrice = Number(product.discounted_price || product.price).toFixed(2);
    const originalPrice = Number(product.price).toFixed(2);

    // 🔥 STOCK LOGIC
    const stockCount = product.stockCount || 0;
    const isOutOfStock = stockCount <= 0;
    const isLowStock = stockCount > 0 && stockCount < 5;

    // 🔥 DYNAMIC RATING MATH
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0) / totalReviews).toFixed(1)
        : (product.rating || 0).toFixed(1);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-gray-800">
            {/* Custom CSS */}
            <style>{`
                .hide-scroll::-webkit-scrollbar { display: none; }
                .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
                .zoom-result {
                    background-image: url(${mainImage});
                    background-position: ${zoomPos.x}% ${zoomPos.y}%;
                    background-repeat: no-repeat;
                    background-size: 250%; 
                }
            `}</style>

            <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
                <span>Home</span> <ChevronRight size={14} />
                <span>Accessories</span> <ChevronRight size={14} />
                <span className="font-semibold text-gray-800">{product.brand || 'Brand'}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 relative">

                {/* LEFT: Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 product-gallery">
                    <div className="flex md:flex-col gap-3 overflow-auto hide-scroll w-full md:w-20">
                        {imagesArray.map((thumb, idx) => (
                            <div
                                key={idx}
                                onMouseEnter={() => setMainImage(thumb)}
                                onClick={() => setMainImage(thumb)}
                                className={`cursor-pointer border-2 p-1 h-20 w-20 flex-shrink-0 flex items-center justify-center rounded transition-all bg-white ${mainImage === thumb ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <img src={thumb} alt={`Thumb ${idx}`} className="max-h-full object-contain" />
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 relative bg-white border border-gray-100 rounded flex items-center justify-center group"
                        ref={imageContainerRef}
                        onMouseEnter={() => setShowZoom(true)}
                        onMouseLeave={() => setShowZoom(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <img src={mainImage || undefined} alt={product.title} className="max-h-[500px] w-full object-contain cursor-crosshair" />
                        {showZoom && (
                            <div className="hidden md:block absolute top-0 left-full ml-4 w-[500px] h-[500px] bg-white border border-gray-200 shadow-2xl z-50 zoom-result"></div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Product Details */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.brand || 'Brand Name'}</h1>
                    <h2 className="text-xl text-gray-500 mb-4">{product.title}</h2>

                    {/* 🔥 DYNAMIC RATING PILL */}
                    <div
                        onClick={handleRatingClick}
                        className="inline-flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 w-max cursor-pointer hover:border-gray-400 transition-colors mb-6 shadow-sm"
                    >
                        <span className="font-bold text-sm">{averageRating}</span>
                        <Star size={14} fill="#14b8a6" className="text-teal-500" />
                        <span className="text-gray-400 text-sm">|</span>
                        <span className="text-sm text-gray-600 hover:text-green-500">{totalReviews} Ratings</span>
                    </div>

                    <hr className="mb-6 border-gray-200" />

                    <div className="mb-6">
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-gray-500 font-medium">MRP</span>
                            <span className="text-3xl font-bold text-gray-900">₹ {currentPrice}</span>
                            {Number(currentPrice) < Number(originalPrice) && (
                                <span className="text-lg text-gray-400 line-through">₹ {originalPrice}</span>
                            )}
                        </div>
                        <span className="text-sm font-bold text-teal-600">inclusive of all taxes</span>
                    </div>

                    {/* SCARCITY WARNING UI */}
                    {isOutOfStock ? (
                        <p className="text-red-500 text-sm font-bold mb-3">This product is currently sold out</p>
                    ) : isLowStock ? (
                        <p className="text-orange-500 text-sm font-bold mb-3 animate-pulse">
                            Hurry! Only {stockCount} items left in stock.
                        </p>
                    ) : null}

                    <div className="flex gap-4 mb-8 mt-2">
                        <button
                            disabled={isOutOfStock}
                            onClick={handleAddToCart}
                            className={`flex-1 h-12 font-bold rounded flex items-center justify-center gap-2 transition-colors ${isOutOfStock ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#ff3e6c] hover:bg-[#e0355f] text-white shadow-md'
                                }`}
                        >
                            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                        </button>
                        <button
                            onClick={() => dispatch(toggleWishlist({
                                id: product.id!,
                                title: product.title,
                                price: Number(product.discounted_price || product.price),
                                img: imagesArray[0] || ''
                            }))}
                            className="p-2 rounded-full border bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            {/* 🔥 YEH HEART ICON MAIN PICHHLI BAAR BHOOL GAYA THA */}
                            <Heart
                                fill={isWishlisted ? "red" : "none"}
                                className={isWishlisted ? "text-red-500" : "text-gray-400"}
                            />
                        </button>
                    </div>

                    <hr className="mb-6 border-gray-200" />

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">PRODUCT DETAILS</h3>
                        <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside space-y-1">
                            <li>100% Original Products</li>
                            <li>Pay on delivery might be available</li>
                            <li>Easy 7 days returns and exchanges</li>
                        </ul>
                    </div>

                    {/* 🔥 PRODUCT DESCRIPTION */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">PRODUCT DESCRIPTION</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {product.description || 'No description available for this product.'}
                        </p>
                    </div>

                </div>
            </div>

            {/* RATINGS & REVIEWS SECTION */}
            <div ref={reviewsRef} className="mt-20 border-t pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>

                {isLoggedIn ? (
                    <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-8">
                        <p className="text-gray-700 mb-4 font-semibold">Leave your review here...</p>

                        <div className="flex gap-1 mb-4 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={28}
                                    fill={rating >= star ? "#f59e0b" : "none"}
                                    color={rating >= star ? "#f59e0b" : "#d1d5db"}
                                    onClick={() => setRating(star)}
                                    className="transition-colors"
                                />
                            ))}
                        </div>

                        <textarea
                            className="w-full border border-gray-300 p-3 rounded mb-4 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                            rows={4}
                            placeholder="Write your experience with this product..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />

                        <button
                            onClick={handleReviewSubmit}
                            disabled={isReviewSubmitting}
                            className={`font-bold py-3 px-8 rounded flex items-center gap-2 transition-colors ${isReviewSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                                }`}
                        >
                            {isReviewSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                            {isReviewSubmitting ? 'Posting...' : 'Post Review'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-red-50 text-red-500 p-4 rounded border border-red-200 flex items-center mb-8">
                        <span className="font-medium">Please login to post or view detailed reviews.</span>
                    </div>
                )}

                {/* 🔥 DYNAMIC REVIEWS LIST */}
                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((rev: any) => (
                            <div key={rev.id} className="border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-800">{rev.userName}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < rev.rating ? "#f59e0b" : "none"} color={i < rev.rating ? "#f59e0b" : "#d1d5db"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{rev.review_text}</p>
                                <span className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;