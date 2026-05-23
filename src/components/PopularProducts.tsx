import { useMemo } from 'react';
import { ShoppingCart, Star, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice'; 

import bean from '../assets/images/Bean.png'; 

// API Hooks Import
import { useGetAllProductsQuery } from '../services/productApi';

const PopularProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- API CALLS (Category completely removed, just fetching top 10 products) ---
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery({ limit: 10 });

  // Safely extract data
  const productsToDisplay = useMemo(() => Array.isArray(productsData) ? productsData : productsData?.products || [], [productsData]);

  return (
    <section className="popular-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* PREMIUM HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#253D4E] mb-2 tracking-tight">
            Popular Products
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Don't miss the current offers on our best-selling items.
          </p>
        </div>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-1.5 text-[#3BB77E] font-bold hover:text-[#2fa06c] hover:underline transition-all"
        >
          View All <ArrowRight size={18} />
        </Link>
      </div>

      {/* ERROR OR LOADING STATE */}
      {isLoading && (
        <div className="w-full flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#3BB77E] w-12 h-12" />
        </div>
      )}
      
      {isError && (
        <div className="text-center py-10 bg-red-50 text-red-500 rounded-xl font-bold border border-red-100">
          Failed to load products. Please check your connection.
        </div>
      )}

      {/* PRODUCT GRID */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productsToDisplay.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No products available right now.
            </div>
          ) : (
            productsToDisplay.map((product: any) => {
              
              // Format product data
              const productImage = product.img ? product.img.split(',')[0] : bean;
              const currentPrice = product.discounted_price || product.price;
              const crossedPrice = (product.discounted_price && product.discounted_price < product.price) 
                                    ? product.price 
                                    : product.oldPrice;

              return (
                <div 
                  key={product.id} 
                  className="group relative bg-white border border-gray-100 rounded-2xl p-4 hover:border-[#3BB77E]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Container with Light Background */}
                  <div 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full aspect-square mb-4 relative overflow-hidden rounded-xl bg-[#f8f9fa] flex items-center justify-center cursor-pointer p-4 group-hover:bg-[#f0f2f5] transition-colors"
                  >
                    {/* Badges positioned inside the image box for cleaner look */}
                    {product.badge && product.badge !== 'None' && (
                      <span 
                        className="absolute top-2 left-2 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md z-10 shadow-sm"
                        style={{ backgroundColor: product.badgeColor || '#3BB77E' }}
                      >
                        {product.badge}
                      </span>
                    )}
                    
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-[#f74b81] text-white text-[11px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">
                        -{product.discount}%
                      </span>
                    )}

                    <img 
                      src={productImage} 
                      alt={product.title} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase mb-1.5">
                      {product.category_name || 'General'}
                    </span>
                    
                    <Link to={`/product/${product.id}`}>
                        <h3 className="text-[15px] font-bold text-[#253D4E] leading-snug mb-2 hover:text-[#3BB77E] transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex text-[#fdc040]">
                        {[...Array(5)].map((_, i) => {
                          const rating = product.rating || 4; 
                          return (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < Math.floor(rating) ? "currentColor" : "none"} 
                              strokeWidth={i < Math.floor(rating) ? 0 : 2} 
                              className={i >= Math.floor(rating) ? "text-gray-300" : ""} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">(4.0)</span>
                    </div>

                    <p className="text-xs text-gray-500 mb-4 mt-auto font-medium">
                      By <span className="text-[#3BB77E] cursor-pointer hover:underline">{product.brand || 'Generic'}</span>
                    </p>

                    {/* Bottom Row: Price & Add Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-[#3BB77E] leading-none">
                          ₹{Number(currentPrice).toFixed(2)}
                        </span>
                        {crossedPrice && (
                          <span className="text-xs font-bold text-gray-400 line-through mt-1">
                            ₹{Number(crossedPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => dispatch(addToCart({
                          ...product,
                          id: product.id,
                          price: currentPrice,
                          img: productImage
                        }))}
                        className="bg-green-50 hover:bg-[#3BB77E] text-[#3BB77E] hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs transition-all duration-300 active:scale-95"
                      >
                        <ShoppingCart size={15} /> Add
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </section>
  );
};

export default PopularProducts;