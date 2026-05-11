import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import deal from '../assets/images/Deal.png';

// --- MOCK DATA ---
const deals = [
  {
    id: 1,
    title: "Organic Cage Grade A Large Eggs",
    brand: "Hambger Hel",
    price: 21.00,
    oldPrice: 24.00,
    img: deal,
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 5000000).getTime() // Random future date
  },
  {
    id: 2,
    title: "Naturally Flavored Cinnamon Vanilla",
    brand: "Hambger Hel",
    price: 51.00,
    oldPrice: 55.00,
    img: deal,
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1 + 8000000).getTime()
  },
  {
    id: 3,
    title: "Seeds of Change Organic Watermelon",
    brand: "Hambger Hel",
    price: 61.50,
    oldPrice: 66.00,
    img: deal,
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 3000000).getTime()
  },
  {
    id: 4,
    title: "Dried fruit: apricots, figs, prunes",
    brand: "USA Noodle Soup",
    price: 56.00,
    oldPrice: 76.00,
    img: deal,
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000000).getTime()
  }
];

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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E] mb-10">Deals Of The Day</h2>

      {/* Grid Layout (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {deals.map((deal) => {
          const timeLeft = calculateTimeLeft(deal.targetDate);
          
          return (
            <div key={deal.id} className="relative group w-full">
              
              {/* Background Image Area */}
              <div className="w-full h-[280px] rounded-2xl overflow-hidden relative">
                <img 
                  src={deal.img} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Timer (Positioned just above the white card) */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 w-full justify-center px-4 z-20">
                  <TimerBox value={timeLeft.days} label="Days" />
                  <TimerBox value={timeLeft.hours} label="Hours" />
                  <TimerBox value={timeLeft.mins} label="Mins" />
                  <TimerBox value={timeLeft.secs} label="Secs" />
                </div>
              </div>

              {/* Floating White Info Card */}
              {/* -mt-8 pulls it up over the image. mx-4 gives it left/right breathing room */}
              <div className="bg-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.06)] p-5 mx-4 -mt-8 relative z-30 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-shadow duration-300">
                
                <h3 className="text-[15px] font-bold text-[#253D4E] line-clamp-2 hover:text-[#3BB77E] cursor-pointer mb-2 leading-snug">
                  {deal.title}
                </h3>
                
                <p className="text-xs text-gray-400 mb-4">
                  By <span className="text-[#3BB77E] hover:underline cursor-pointer">{deal.brand}</span>
                </p>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#3BB77E]">${deal.price.toFixed(2)}</span>
                    <span className="text-xs font-medium text-gray-400 line-through ml-1.5">
                      ${deal.oldPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="bg-[#def9ec] hover:bg-[#3BB77E] text-[#3BB77E] hover:text-white px-3 py-1.5 rounded flex items-center gap-1.5 font-bold text-xs transition-colors duration-300">
                    <ShoppingCart size={14} /> Add
                  </button>
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