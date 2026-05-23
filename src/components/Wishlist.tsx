// src/pages/WishlistPage.tsx
import React from 'react';
import { Heart, Trash2, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../features/wishlistSlice';
import { addToCart } from '../features/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState } from '../store/store';

const WishlistPage: React.FC = () => {
    const items = useSelector((state: RootState) => state.wishlist.wishlistItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12 font-sans text-[#253D4E]">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 font-bold hover:text-[#3BB77E] transition-colors mb-6">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Continue Shopping
                </button>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <Heart className="text-red-500" fill="currentColor" size={32} /> My Wishlist
                    </h1>
                    <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg text-sm">
                        {items.length} Items
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white p-16 rounded-[2rem] text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                        <Heart className="text-gray-200 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-[#253D4E]">Your wishlist is empty!</h3>
                        <p className="text-gray-500 mt-2">Save items you love and buy them later.</p>
                        <Link to="/shop" className="mt-6 bg-[#3BB77E] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-4 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                    <img src={item.img} alt={item.title} className="w-full h-48 object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(toggleWishlist(item));
                                        }}
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 p-2 rounded-full text-red-500 transition-colors shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <h3 className="font-bold text-lg text-[#253D4E] line-clamp-2 mb-2 flex-1">{item.title}</h3>

                                <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
                                    <span className="text-xl font-black text-[#3BB77E]">₹{item.price.toFixed(2)}</span>

                                    <button
                                        onClick={() => {
                                            // 🔥 Bas item bhej do, quantity cartSlice khud manage kar lega
                                            dispatch(addToCart(item));
                                            dispatch(toggleWishlist(item));
                                        }}
                                        className="bg-[#def9ec] hover:bg-[#3BB77E] text-[#3BB77E] hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors"
                                    >
                                        <ShoppingCart size={16} /> Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;