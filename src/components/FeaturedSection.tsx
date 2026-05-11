import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import burger from '../assets/images/Burger.png';
import kiwi from '../assets/images/kiwi.png';
import peach from '../assets/images/peach.png';
import fruits from '../assets/images/fruits.webp';
import vegetables from '../assets/images/vegetables.webp';
import grocery from '../assets/images/grocery.png';


// 🔥 API Hook Import (Path apne hisaab se adjust kar lena)
import { useGetCategoriesQuery } from '../services/productApi'; 

// --- FALLBACK ASSETS ---
// Agar backend se color ya image nahi aati, toh ye loop mein use honge
const bgColors = ['bg-[#f2fce4]', 'bg-[#fffceb]', 'bg-[#ecffec]', 'bg-[#feefea]', 'bg-[#fff3eb]', 'bg-[#fff3ff]'];
const fallbackImages = [burger, kiwi, peach];

// --- BANNERS (Ye static the, isliye inko wahi rakha hai) ---
const banners = [
  {
    id: 1,
    title: "Everyday Fresh & Clean with Our Products",
    bg: "bg-[#f0e8d5]",
    img: fruits
  },
  {
    id: 2,
    title: "Make your Breakfast Healthy and Easy",
    bg: "bg-[#f3e8e8]",
    img: vegetables
  },
  {
    id: 3,
    title: "The best Organic Products Online",
    bg: "bg-[#e7eaf3]",
    img: grocery
  }
];

const FeaturedSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔥 Fetching Categories from API
  const { data: apiCategories, isLoading, isError } = useGetCategoriesQuery();

  // Scroll function for category arrows
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* --- HEADER: Featured Categories --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Featured Categories</h2>
          
         
          {/* <div className="hidden lg:flex gap-6 text-sm font-medium text-gray-600">
            {apiCategories?.slice(0, 4).map(cat => (
               <a key={cat.id} href="#" className="hover:text-[#3BB77E] transition-colors">{cat.name}</a>
            ))}
          </div> */}
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 bg-gray-100 hover:bg-[#3BB77E] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* --- CATEGORIES CAROUSEL --- */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Loading State */}
        {isLoading && (
            <div className="w-full flex justify-center py-10">
                <Loader2 className="animate-spin text-[#3BB77E] w-10 h-10" />
            </div>
        )}

        {/* Error State */}
        {isError && (
            <div className="text-red-500 font-medium py-10">Failed to load categories.</div>
        )}

        {/* Data Mapping */}
        {!isLoading && !isError && apiCategories?.map((category: any, index: number) => {
          // Fallback properties agar API mein na hon
          const categoryImage = category.img || fallbackImages[index % fallbackImages.length];
          const categoryBg = category.bg || bgColors[index % bgColors.length];
          // const categoryItems = category.items_count !== undefined ? `${category.items_count} items` : 'Explore';

          return (
            <div 
              key={category.id} 
              className={`min-w-[130px] flex-shrink-0 snap-start flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer border border-transparent hover:border-[#3BB77E]/30 hover:shadow-md transition-all duration-300 ${categoryBg}`}
            >
              <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white/50 flex items-center justify-center">
                <img 
                  src={categoryImage} 
                  alt={category.name} 
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <h3 className="text-sm font-bold text-[#253D4E] text-center mb-1">{category.name}</h3>
              {/* <p className="text-xs text-gray-500">{categoryItems}</p> */}
            </div>
          );
        })}

        {/* Agar database khali ho */}
        {!isLoading && apiCategories?.length === 0 && (
             <div className="text-gray-500 py-4">No categories found in database.</div>
        )}
      </div>

      {/* --- PROMO BANNERS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className={`relative rounded-xl overflow-hidden flex h-48 sm:h-56 p-6 ${banner.bg} hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="relative z-10 flex flex-col justify-center max-w-[60%]">
              <h3 className="text-xl sm:text-2xl font-bold text-[#253D4E] leading-snug mb-6">
                {banner.title}
              </h3>
              <div>
                <button className="bg-[#3BB77E] hover:bg-[#2fa06c] text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1 transition-colors">
                  Shop Now <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 h-full w-[50%]">
              <img 
                src={banner.img} 
                alt="Promo" 
                className="w-full h-full object-cover mix-blend-multiply opacity-90"
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedSection;