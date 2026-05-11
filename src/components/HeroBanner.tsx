import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import banner2 from '../assets/images/banner2.png';

const slides = [
  {
    id: 1,
    title: "Fresh Vegetables\nBig discount",
    subtitle: "Save up to 50% off on your first order",
    image: banner2,
    bgColor: "bg-[#e3f4e6]" // Light Green
  },
  {
    id: 2,
    title: "Organic Fruits\nFarm to Table",
    subtitle: "100% natural and freshly picked daily",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=80",
    bgColor: "bg-[#fceee1]" // Light Orange/Peach
  },
  {
    id: 3,
    title: "Everyday Groceries\nBest Prices",
    subtitle: "Get free delivery on orders over $50",
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=700&q=80",
    bgColor: "bg-[#e6f2f5]" // Light Blue
  }
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide effect (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 font-sans">
      
      {/* Main Banner Container with dynamic background */}
      <div className={`rounded-[2rem] overflow-hidden relative flex flex-col md:flex-row items-center px-8 md:px-16 py-12 transition-colors duration-700 ease-in-out ${slides[current].bgColor}`}>
        
        {/* Left Content Area (Text & Form) */}
        <div className="flex-1 z-10 w-full flex flex-col justify-center">
          
          {/* Fading Text Container */}
          <div className="relative h-[180px] md:h-[200px] w-full mb-4">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  current === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#253D4E] leading-tight mb-4 tracking-tight whitespace-pre-line">
                  {slide.title}
                </h1>
                <p className="text-gray-500 text-lg">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* FIXED EMAIL INPUT FORM - Never Moves */}
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="relative z-20 flex items-center bg-white rounded-full p-1 max-w-md w-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white"
          >
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-6 py-3 text-sm text-gray-700 w-full placeholder-gray-400"
              required
            />
            <button 
              type="submit" 
              className="bg-[#3BB77E] hover:bg-[#2fa06c] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-colors duration-300 flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Right Image Area */}
        <div className="flex-1 flex justify-center md:justify-end items-center mt-12 md:mt-0 z-10 w-full relative h-[250px] md:h-[350px]">
          {slides.map((slide, index) => (
            <img 
              key={slide.id}
              src={slide.image} 
              alt="Grocery Banner" 
              className={`absolute w-full max-w-[350px] md:max-w-[420px] h-full object-cover rounded-2xl drop-shadow-xl transition-all duration-700 ease-in-out ${
                current === index ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center text-gray-500 shadow-sm transition-all z-30 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center text-gray-500 shadow-sm transition-all z-30 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        {/* Pagination Dots at Bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                current === index 
                  ? 'bg-[#3BB77E] border-2 border-[#3BB77E]' 
                  : 'bg-transparent border-2 border-[#3BB77E] hover:bg-[#3BB77E]/50'
              }`}
            ></button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;