import { useRef,useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom'; // 🔥 Navigation ke liye Link import kiya
import burger from '../assets/images/Burger.png';
import kiwi from '../assets/images/kiwi.png';
import peach from '../assets/images/peach.png';
import fruits from '../assets/images/fruits.webp';
import vegetables from '../assets/images/vegetables.webp';
import grocery from '../assets/images/grocery.png';

// 🔥 API Hook Import
import { useGetCategoriesQuery } from '../services/productApi'; 

// --- FALLBACK ASSETS ---
const bgColors = ['bg-[#f2fce4]', 'bg-[#fffceb]', 'bg-[#ecffec]', 'bg-[#feefea]', 'bg-[#fff3eb]', 'bg-[#fff3ff]'];
const fallbackImages = [burger, kiwi, peach];

// --- BANNERS ---
const banners = [
  { id: 1, title: "Everyday Fresh & Clean with Our Products", bg: "bg-[#f0e8d5]", img: fruits },
  { id: 2, title: "Make your Breakfast Healthy and Easy", bg: "bg-[#f3e8e8]", img: vegetables },
  { id: 3, title: "The best Organic Products Online", bg: "bg-[#e7eaf3]", img: grocery },
  { id: 4, title: "Farm Fresh Fruits Delivered Daily", bg: "bg-[#e8f3e9]", img: fruits },
  { id: 5, title: "Premium Quality Daily Dairy Needs", bg: "bg-[#f3f0e8]", img: grocery },
  { id: 6, title: "Organic Spices & Condiments", bg: "bg-[#f3e8f0]", img: vegetables },
  { id: 7, title: "Refreshing Beverages & Cold Drinks", bg: "bg-[#e8f0f3]", img: fruits },
  { id: 8, title: "Delicious Snacks & Munchies", bg: "bg-[#f0f3e8]", img: grocery },
  { id: 9, title: "Household Care & Cleaning", bg: "bg-[#e8e8f3]", img: vegetables },
  { id: 10, title: "Baby Care & Healthy Essentials", bg: "bg-[#f3e8e8]", img: fruits },
];

const FeaturedSection = () => {

  const [carouselBanners, setCarouselBanners] = useState(banners);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // 500ms (animation time) ke baad state update karo
    setTimeout(() => {
      setCarouselBanners((prev) => {
        const newArr = [...prev];
        const firstItem = newArr.shift(); // Pehla nikalo
        if (firstItem) newArr.push(firstItem); // Aakhri mein daalo
        return newArr;
      });
      setIsAnimating(false);
    }, 500); // Ye time Tailwind duration ke barabar hona chahiye
  };

  useEffect(() => {
    if (isHovered) return; // Hover hone par ruk jaye
    const interval = setInterval(handleNext, 3000); // 3 seconds mein agla
    return () => clearInterval(interval);
  }, [isHovered, carouselBanners]); // array change hone par reset ho

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

  // FeaturedSection component ke andar jahan aapke hooks hain wahan ye add karein:
const bannerScrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const scrollInterval = setInterval(() => {
    if (bannerScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = bannerScrollRef.current;
      
      // Agar scroll end tak pahunch gaya hai, toh wapas 0 par le aao (smoothly)
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        bannerScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Warna ek card ki width ke barabar aage slide karo (approx 350px)
        bannerScrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
      }
    }
  }, 3000); // Har 3 second mein slide hoga

  return () => clearInterval(scrollInterval);
}, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* --- HEADER: Featured Categories --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Featured Categories</h2>
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
          const categoryImage = category.img || fallbackImages[index % fallbackImages.length];
          const categoryBg = category.bg || bgColors[index % bgColors.length];

          return (
            // 🔥 Yahan 'div' ko 'Link' mein badal diya aur 'to' attribute add kar diya
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

        {/* Agar database khali ho */}
        {!isLoading && apiCategories?.length === 0 && (
             <div className="text-gray-500 py-4">No categories found in database.</div>
        )}
      </div>

      {/* --- PROMO BANNERS --- */}
   <div 
        className="mt-10 relative overflow-hidden" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Track */}
        <div 
          className={`flex gap-6 transition-transform ease-in-out ${isAnimating ? 'duration-500' : 'duration-0'}`}
          // Card width + gap (approx 33.33% of container)
          style={{ transform: isAnimating ? `translateX(calc(-33.333% - 1.5rem))` : 'translateX(0)' }}
        >
          {/* Loop over modified array. We render 4 cards visually to handle the "sliding out" effect smoothly */}
          {carouselBanners.slice(0, 4).map((banner, index) => (
            <div 
              key={`${banner.id}-${index}`} 
              // Har card exact 1/3 jagah lega
              className={`w-[calc(33.333%-1rem)] flex-shrink-0 relative rounded-xl overflow-hidden flex h-48 sm:h-56 p-6 ${banner.bg} hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="relative z-10 flex flex-col justify-center max-w-[60%]">
                <h3 className="text-xl sm:text-2xl font-bold text-[#253D4E] leading-snug mb-6">
                  {banner.title}
                </h3>
                <div>
                  <Link to="/shop" className="bg-[#3BB77E] hover:bg-[#2fa06c] inline-flex text-white text-xs font-bold px-4 py-2 rounded items-center gap-1 transition-colors">
                    Shop Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 h-full w-[50%]">
                <img 
                  src={banner.img} 
                  alt="Promo" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-500"
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