import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import rice from '../assets/images/rice-bowl.png';
import drink from '../assets/images/soft-drink.png';
import jar from '../assets/images/honey.png';
import chocolate from '../assets/images/chocolate-bar.png';
import clean from '../assets/images/cleaning.png';
import icecream from '../assets/images/ice-cream.png';
import health from '../assets/images/healthcare.png';
import home from '../assets/images/hand.png';
import kitchen from '../assets/images/kitchen.png';
import masala from '../assets/images/masala.png';
import cosmetics from '../assets/images/cosmetics.png';
import snack from '../assets/images/snack.png';
import  meat from '../assets/images/meat.png';
import coffee from '../assets/images/coffee-cup.png';
import child from '../assets/images/child.png';
import bread from '../assets/images/bread.png';
import chips from '../assets/images/chips-bg.webp';
import stationary from '../assets/images/stationary.png';
import breakfast from '../assets/images/breakfast.png';
import container from '../assets/images/container.webp';
import icecream1 from '../assets/images/icecream.webp';
import mustard from '../assets/images/mustard-oil.webp';
import grocery from '../assets/images/grocery.png';

import { useGetCategoriesQuery } from '../services/productApi';

const bgColors = ['bg-[#f2fce4]', 'bg-[#fffceb]', 'bg-[#ecffec]', 'bg-[#feefea]', 'bg-[#fff3eb]', 'bg-[#fff3ff]'];
const fallbackImages = [rice, child, bread, drink, breakfast, jar, chocolate, clean, icecream, health, home, kitchen, masala, cosmetics, snack, meat,stationary, coffee];

const banners = [
  { id: 1, title: "Everyday Fresh & Clean with Our Products", bg: "bg-[#f0e8d5]", img: chips },
  { id: 2, title: "Make your Breakfast Healthy and Easy", bg: "bg-[#f3e8e8]", img: container },
  { id: 3, title: "The best Organic Products Online", bg: "bg-[#e7eaf3]", img: icecream1 },
  { id: 4, title: "Farm Fresh Fruits Delivered Daily", bg: "bg-[#e8f3e9]", img: mustard },
  { id: 5, title: "Premium Quality Daily Dairy Needs", bg: "bg-[#f3f0e8]", img: grocery },
  { id: 7, title: "Refreshing Beverages & Cold Drinks", bg: "bg-[#e8f0f3]", img: mustard },
  { id: 8, title: "Delicious Snacks & Munchies", bg: "bg-[#f0f3e8]", img: grocery },
  { id: 10, title: "Baby Care & Healthy Essentials", bg: "bg-[#f3e8e8]", img: mustard },
];

// 🔥 Seamless Loop ban banane ke liye array ko 3 baar duplicate kar diya
const infiniteBanners = [...banners, ...banners, ...banners]; 

const FeaturedSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const promoScrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: apiCategories, isLoading, isError } = useGetCategoriesQuery();

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // --- 🔥 UPDATED: Infinite Seamless Scroll Logic ---
  useEffect(() => {
    if (isHovered || isDragging) return;

    const scrollInterval = setInterval(() => {
      if (promoScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = promoScrollRef.current;
        const cardWidth = promoScrollRef.current.children[0]?.clientWidth || 350;

        // Agar list ke end ke kareeb pahunch gaye hain
        if (scrollLeft + clientWidth >= scrollWidth - cardWidth) {
          // Instant jump wapas start par (No Smooth Rewind)
          promoScrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          // Normal aage scroll karo
          promoScrollRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!promoScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - promoScrollRef.current.offsetLeft);
    setScrollLeft(promoScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !promoScrollRef.current) return;
    e.preventDefault(); 
    const x = e.pageX - promoScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    promoScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="feature-container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Featured Categories</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scrollCategories('left')}
            className="w-10 h-10 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => scrollCategories('right')}
            className="w-10 h-10 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* --- CATEGORIES CAROUSEL --- */}
      <div
        ref={categoryScrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading && (
          <div className="w-full flex justify-center py-10">
            <Loader2 className="animate-spin text-[#3BB77E] w-10 h-10" />
          </div>
        )}

        {isError && (
          <div className="text-red-500 font-medium py-10">Failed to load categories.</div>
        )}

        {!isLoading && !isError && apiCategories?.map((category: any, index: number) => {
          const categoryImage = category.img || fallbackImages[index % fallbackImages.length];
          const categoryBg = category.bg || bgColors[index % bgColors.length];

          return (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={`min-w-[130px] flex-shrink-0 snap-start flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer border border-transparent hover:border-[#3BB77E]/30 hover:shadow-md transition-all duration-300 ${categoryBg}`}
            >
              <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white/50 flex items-center justify-center">
                <img
                  src={categoryImage}
                  alt={category.name}
                  className="w-full h-full object-cover mix-blend-multiply transition-transform hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-bold text-[#253D4E] text-center mb-1">{category.name}</h3>
            </Link>
          );
        })}
      </div>

      {/* --- PROMO BANNERS --- */}
      <div className="mt-10 relative">
        <div
          ref={promoScrollRef}
          className={`flex gap-6 overflow-x-auto pb-6 hide-scrollbar cursor-${isDragging ? 'grabbing' : 'grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {/* 🔥 Yahan ab hum 'infiniteBanners' use kar rahe hain */}
          {infiniteBanners.map((banner, index) => (
            <div
              key={`${banner.id}-${index}`} 
              className={`w-[85vw] sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1rem)] flex-shrink-0 relative rounded-xl overflow-hidden flex h-48 sm:h-56 p-6 ${banner.bg} hover:shadow-lg transition-shadow duration-300 select-none`}
            >
              <div className="relative z-10 flex flex-col justify-center max-w-[60%] pointer-events-none">
                <h3 className="text-xl sm:text-2xl font-bold text-[#253D4E] leading-snug mb-6">
                  {banner.title}
                </h3>
                <div className="pointer-events-auto">
                  <Link
                    to="/shop"
                    onClick={(e) => isDragging && e.preventDefault()}
                    className="bg-[#3BB77E] hover:bg-[#2fa06c] inline-flex text-white text-xs font-bold px-4 py-2 rounded items-center gap-1 transition-colors"
                  >
                    Shop Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 h-full w-[50%] pointer-events-none">
                <img
                  src={banner.img}
                  alt="Promo"
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-500 pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default FeaturedSection;