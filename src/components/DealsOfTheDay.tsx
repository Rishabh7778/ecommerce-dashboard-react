import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom'; // 🔥 Navigation ke liye add kiya
import { useGetDealsQuery } from '../services/offerApi'; 

// TypeScript Interface (Taki errors na aaye)
interface Deal {
  id: number;
  productId: number; // JOIN ki wajah se ab hume ye mil raha hai
  title: string;
  brand: string;
  price: number | string;
  oldPrice: number | string;
  img: string;
  targetDate: number;
}

// Reusable Timer Box Component
const TimerBox = ({ value, label }: { value: number, label: string }) => (
  <div className="bg-white rounded-[6px] shadow-sm w-12 h-14 flex flex-col items-center justify-center">
    <span className="text-[#3BB77E] font-bold text-lg leading-none mb-1">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-gray-500 text-[10px] leading-none">{label}</span>
  </div>
);

const DealsOfTheDay = () => {
  // Fetch dynamic data from API
  const { data, isLoading, isError } = useGetDealsQuery();
  const deals: Deal[] = data?.deals || [];

  // Live Countdown Hook
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = (target: number) => {
    const difference = target - now;
    if (difference <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / 1000 / 60) % 60),
      secs: Math.floor((difference / 1000) % 60)
    };
  };

  if (isLoading) return <div className="text-center py-10 font-bold text-[#3BB77E]">Loading Deals...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load deals.</div>;
  if (deals.length === 0) return null; // Deals na ho toh section hide kar do

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id='deals-of-the-day'>
      
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E] mb-10">Deals Of The Day</h2>

      {/* Grid Layout (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {deals.map((deal) => {
          const timeLeft = calculateTimeLeft(deal.targetDate);
          
          // 🔥 FIX: Agar image comma-separated hai, toh sirf pehli image uthao
          const singleImageUrl = deal.img ? deal.img.split(',')[0] : '';
          
          return (
            <div key={deal.id} className="relative group w-full">
              
              {/* Background Image Area (Clickable) */}
              <Link to={`/product/${deal.productId}`} className="block w-full h-[280px] rounded-2xl overflow-hidden relative bg-gray-100">
                <img 
                  src={singleImageUrl} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Timer */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 w-full justify-center px-4 z-20">
                  <TimerBox value={timeLeft.days} label="Days" />
                  <TimerBox value={timeLeft.hours} label="Hours" />
                  <TimerBox value={timeLeft.mins} label="Mins" />
                  <TimerBox value={timeLeft.secs} label="Secs" />
                </div>
              </Link>

              {/* Floating White Info Card */}
              <div className="bg-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.06)] p-5 mx-4 -mt-8 relative z-30 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                
                {/* Title (Clickable) */}
                <Link to={`/product/${deal.productId}`}>
                  <h3 className="text-[15px] font-bold text-[#253D4E] line-clamp-2 hover:text-[#3BB77E] cursor-pointer mb-2 leading-snug">
                    {deal.title}
                  </h3>
                </Link>
                
                <p className="text-xs text-gray-400 mb-4">
                  By <span className="text-[#3BB77E] hover:underline cursor-pointer">{deal.brand}</span>
                </p>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#3BB77E]">${Number(deal.price).toFixed(2)}</span>
                    {Number(deal.oldPrice) > Number(deal.price) && (
                      <span className="text-xs font-medium text-gray-400 line-through ml-1.5">
                        ${Number(deal.oldPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Redirects to product page or can trigger Add to Cart */}
                  <Link to={`/product/${deal.productId}`} className="bg-[#def9ec] hover:bg-[#3BB77E] text-[#3BB77E] hover:text-white px-3 py-1.5 rounded flex items-center gap-1.5 font-bold text-xs transition-colors duration-300">
                    <ShoppingCart size={14} /> Shop
                  </Link>
                </div>

              </div>
              
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default DealsOfTheDay;