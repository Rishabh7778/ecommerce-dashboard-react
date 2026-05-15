import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, Star, ArrowRight as ArrowRightIcon, Loader2 } from 'lucide-react';
import leaf from "../assets/images/Leaf.png";
import dandy from "../assets/images/Dandy.png";

// 🔥 Hooks Imports for Routing & Redux
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { useGetAllProductsQuery } from '../services/productApi';

const DailyBestSells = () => {
  const [activeTab] = useState("All");
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Setup Router & Dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Mouse Drag States ---
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false); // 🔥 Track if actually dragged

  // API Call
  const { data: productsData, isLoading } = useGetAllProductsQuery({ limit: 'all' });
  const allProducts = Array.isArray(productsData) ? productsData : productsData?.products || [];

  const dailyDeals = allProducts.filter((p: any) => p.discount > 0);
  const filteredProducts = dailyDeals.filter((p: any) =>
    activeTab === "All" || activeTab === "Deals Of the Day" || p.category_name === activeTab
  );

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // --- Drag Functions ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setDragged(false); // Reset drag tracker
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    setDragged(true); // User is dragging, not clicking
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // 🔥 Navigate to Details Page
  const handleProductClick = (productId: string | number) => {
    if (!dragged) {
      navigate(`/product/${productId}`);
    }
  };

  // 🔥 Add to Cart Logic
  const handleAddToCart = (e: React.MouseEvent, product: any, discountedPrice: number, productImage: string) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    if (dragged) return; // Drag karte waqt click na ho
    
    dispatch(addToCart({
        ...product,
        id: product.id,
        price: discountedPrice,
        img: productImage
    }));
  };

  return (
    <section className="Daily-container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-6 justify-between w-full lg:w-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Daily Best Sells</h2>
          <div className="flex gap-2 lg:hidden">
            <button onClick={() => scroll('left')} className="w-8 h-8 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors">
              <ArrowLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        {/* Left Banner */}
        <div className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 relative rounded-2xl overflow-hidden min-h-[250px] lg:min-h-[400px] flex items-start p-6 lg:p-8 shadow-sm group">
          <img src={leaf} alt="Leaf Background" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#e8f5ed]/90 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-start mt-4">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#253D4E] leading-snug mb-6">
              Bring nature <br className="hidden lg:block" /> into your <br className="hidden lg:block" /> home
            </h3>
            <button className="bg-[#3BB77E] hover:bg-[#2fa06c] text-white text-sm font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-colors">
              Shop Now <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* Slider Section */}
        <div className="flex-1 min-w-0 relative">
          <div
            ref={sliderRef}
            className={`flex gap-4 lg:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar cursor-${isDragging ? 'grabbing' : 'grab'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {isLoading && (
              <div className="w-full flex items-center justify-center min-h-[300px]">
                <Loader2 className="animate-spin text-[#3BB77E] w-10 h-10" />
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="w-full flex items-center justify-center min-h-[300px] text-gray-500 font-medium">
                No daily deals available right now.
              </div>
            )}

            {!isLoading && filteredProducts.map((product: any) => {
              const originalPrice = Number(product.price);
              const discountAmount = originalPrice * (Number(product.discount) / 100);
              const discountedPrice = originalPrice - discountAmount;
              const productImage = product.img ? product.img.split(',')[0] : dandy;
              const rating = product.rating || 4.5;
              const totalStock = product.stockCount || 100;
              const soldItems = product.soldCount || Math.floor(totalStock * 0.75);
              const soldPercentage = (soldItems / totalStock) * 100;

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)} // 🔥 Added Click to route
                  className="min-w-[240px] md:min-w-[280px] w-[240px] md:w-[280px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-[1.2rem] p-5 hover:border-[#3BB77E] hover:shadow-[0_10px_20px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col relative group select-none cursor-pointer"
                >
                  <span className="absolute top-0 left-0 bg-[#3BB77E] text-white text-[11px] font-bold px-3 py-1.5 rounded-tl-[1.1rem] rounded-br-[1.1rem] z-10">
                    {product.discount}% Off
                  </span>

                  {product.badge && product.badge !== 'None' && (
                    <span className="absolute top-0 right-0 text-white text-[11px] font-bold px-3 py-1.5 rounded-tr-[1.1rem] rounded-bl-[1.1rem] z-10" style={{ backgroundColor: product.badgeColor || '#f74b81' }}>
                      {product.badge}
                    </span>
                  )}

                  <div className="w-full h-40 md:h-48 mb-4 relative overflow-hidden rounded-xl flex items-center justify-center pointer-events-none bg-gray-50/50">
                    <img src={productImage} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                  </div>

                  <span className="text-[11px] text-gray-400 mb-1">{product.category_name || 'General'}</span>
                  <h3 className="text-[14px] md:text-[15px] font-bold text-[#253D4E] leading-snug mb-2 hover:text-[#3BB77E] line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-[#fdc040]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(rating) ? "currentColor" : "none"} strokeWidth={i < Math.floor(rating) ? 0 : 2} className={i >= Math.floor(rating) ? "text-gray-300" : ""} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{product.reviewsCount || 0}</span>
                  </div>

                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-lg font-bold text-[#3BB77E]">₹{discountedPrice.toFixed(2)}</span>
                    <span className="text-sm font-medium text-gray-400 line-through mb-0.5">₹{originalPrice.toFixed(2)}</span>
                  </div>

                  <div className="mt-auto mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div className="bg-[#3BB77E] h-1.5 rounded-full" style={{ width: `${soldPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-[#253D4E]">Sold: {soldItems} / {totalStock}</span>
                      <span className="text-[#3BB77E]">{Math.round(soldPercentage)}%</span>
                    </div>
                  </div>

                  {/* 🔥 Add to Cart Handler attached here */}
                  <button
                    onClick={(e) => handleAddToCart(e, product, discountedPrice, productImage)}
                    className="w-full bg-[#3BB77E] hover:bg-[#2fa06c] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-colors duration-300 pointer-events-auto z-20 relative"
                  >
                    <ShoppingCart size={16} /> Add to cart
                  </button>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default DailyBestSells;