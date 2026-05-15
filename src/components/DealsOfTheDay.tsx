import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetDealsQuery } from '../services/offerApi';

// TypeScript Interface
interface Deal {
  id: number;
  productId: number;
  title: string;
  brand: string;
  price: number | string;
  oldPrice: number | string;
  img: string;
  targetDate: number;
}

// ⏳ Single Timer Box
const TimerBox = ({ value, label }: { value: number; label: string }) => (
  <div className="bg-white rounded-[6px] shadow-sm w-12 h-14 flex flex-col items-center justify-center">
    <span className="text-[#3BB77E] font-bold text-lg leading-none mb-1">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-gray-500 text-[10px] leading-none">{label}</span>
  </div>
);

// 🚀 Performance Fix: Timer ko alag component banaya taki pura slider har second re-render na ho
const DealTimer = ({ targetDate }: { targetDate: number }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const difference = targetDate - now;
  const days = difference > 0 ? Math.floor(difference / (1000 * 60 * 60 * 24)) : 0;
  const hours = difference > 0 ? Math.floor((difference / (1000 * 60 * 60)) % 24) : 0;
  const mins = difference > 0 ? Math.floor((difference / 1000 / 60) % 60) : 0;
  const secs = difference > 0 ? Math.floor((difference / 1000) % 60) : 0;

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 w-full justify-center px-4 z-20">
      <TimerBox value={days} label="Days" />
      <TimerBox value={hours} label="Hours" />
      <TimerBox value={mins} label="Mins" />
      <TimerBox value={secs} label="Secs" />
    </div>
  );
};

const DealsOfTheDay = () => {
  const { data, isLoading, isError } = useGetDealsQuery();
  const deals: Deal[] = data?.deals || [];

  // Local state for Infinite Array Rotation
  const [dealsList, setDealsList] = useState<Deal[]>([]);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [offset, setOffset] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Drag & Swipe states
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Sync API data with local state
  useEffect(() => {
    if (deals.length > 0) setDealsList(deals);
  }, [deals]);

  // Responsive Items Per View
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);       // Mobile
      else if (window.innerWidth < 1024) setItemsPerView(2); // Tablet
      else if (window.innerWidth < 1280) setItemsPerView(3); // Small Desktop
      else setItemsPerView(4);                               // Large Desktop
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSliderNeeded = dealsList.length > itemsPerView;

  // ➡️ NEXT logic (True Infinite, No Rewind)
  const handleNext = () => {
    if (isAnimating || !isSliderNeeded) return;
    setIsAnimating(true);
    setWithTransition(true);
    setOffset(-1); // Smoothly slide Left by 1 card

    setTimeout(() => {
      setWithTransition(false); // Turn off transition for instant swap
      setDealsList((prev) => {
        const newArr = [...prev];
        const first = newArr.shift()!; // Remove first item
        newArr.push(first);            // Push it to the end
        return newArr;
      });
      setOffset(0); // Instantly snap back container
      setTimeout(() => setIsAnimating(false), 50); // Free up animation lock
    }, 500); // 500ms is the CSS transition duration
  };

  // ⬅️ PREV logic (True Infinite, No Rewind)
  const handlePrev = () => {
    if (isAnimating || !isSliderNeeded) return;
    setIsAnimating(true);

    setWithTransition(false); // Turn off transition
    setDealsList((prev) => {
      const newArr = [...prev];
      const last = newArr.pop()!;  // Take last item
      newArr.unshift(last);        // Put it at the beginning
      return newArr;
    });
    setOffset(-1); // Instantly shift container left to hide the new first item

    setTimeout(() => {
      setWithTransition(true); // Turn transition back on
      setOffset(0);            // Smoothly slide Right into view
      setTimeout(() => setIsAnimating(false), 500);
    }, 50); 
  };

  // 👆 Drag / Swipe Handlers
  const handleDragStart = (clientX: number) => {
    if (!isSliderNeeded) return;
    setIsDragging(true);
    setDragStart(clientX);
  };

  const handleDragEnd = (clientX: number) => {
    if (!dragStart || !isDragging) return;
    setIsDragging(false);
    const distance = dragStart - clientX;
    
    if (distance > 50) handleNext(); // Swiped Left
    else if (distance < -50) handlePrev(); // Swiped Right
    
    setDragStart(0);
  };

  if (isLoading) return <div className="text-center py-10 font-bold text-[#3BB77E]">Loading Deals...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load deals.</div>;
  if (dealsList.length === 0) return null;

  return (
    <section className="deals-container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="deals-of-the-day">
      
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">Deals Of The Day</h2>
        
        {isSliderNeeded && (
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#3BB77E] hover:text-white transition-colors text-gray-600 shadow-sm cursor-pointer z-10"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#3BB77E] hover:text-white transition-colors text-gray-600 shadow-sm cursor-pointer z-10"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Slider Container (With Mouse & Touch Swipe) */}
      <div 
        className={`relative overflow-hidden pb-4 ${isSliderNeeded ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="flex w-full"
          style={{
            transform: `translateX(${offset * (100 / itemsPerView)}%)`,
            transition: withTransition ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {dealsList.map((deal) => {
            const singleImageUrl = deal.img ? deal.img.split(',')[0] : '';

            return (
              <div 
                key={`${deal.id}-${deal.title}`} // Composite key prevents React confusion during array rotation
                className="shrink-0 px-3 pointer-events-none" // pointer-events-none ensures clean drag
                style={{ width: `${100 / itemsPerView}%` }}
              >
                {/* Restore pointer events inside the actual card */}
                <div className="relative group w-full pt-4 pointer-events-auto">
                  
                  {/* Background Image Area */}
                  <Link to={`/product/${deal.productId}`} className="block w-full h-[280px] rounded-2xl overflow-hidden relative bg-gray-100">
                    <img
                      src={singleImageUrl}
                      alt={deal.title}
                      draggable="false" // 🔥 Important: Prevents native browser image dragging
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Render Performance-Optimized Timer Component */}
                    <DealTimer targetDate={deal.targetDate} />
                  </Link>

                  {/* Floating Info Card */}
                  <div className="bg-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.06)] p-5 mx-4 -mt-8 relative z-30 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                    <Link to={`/product/${deal.productId}`}>
                      <h3 className="text-[15px] font-bold text-[#253D4E] line-clamp-2 hover:text-[#3BB77E] cursor-pointer mb-2 leading-snug">
                        {deal.title}
                      </h3>
                    </Link>
                    
                    <p className="text-xs text-gray-400 mb-4">
                      By <span className="text-[#3BB77E] hover:underline cursor-pointer">{deal.brand}</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#3BB77E]">${Number(deal.price).toFixed(2)}</span>
                        {Number(deal.oldPrice) > Number(deal.price) && (
                          <span className="text-xs font-medium text-gray-400 line-through ml-1.5">
                            ${Number(deal.oldPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <Link to={`/product/${deal.productId}`} className="bg-[#def9ec] hover:bg-[#3BB77E] text-[#3BB77E] hover:text-white px-3 py-1.5 rounded flex items-center gap-1.5 font-bold text-xs transition-colors duration-300">
                        <ShoppingCart size={14} /> Shop
                      </Link>
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheDay;