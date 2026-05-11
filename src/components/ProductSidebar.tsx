import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Tag, Star } from 'lucide-react';

interface ProductSidebarProps {
  onCategoryChange: (category: string) => void;
  onPriceChange: (price: number) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({ onCategoryChange, onPriceChange }) => {
  const [price, setPrice] = useState(1000);
  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen'];

  return (
    <aside className="group fixed left-0 top-0 h-screen w-20 hover:w-72 bg-white border-r border-gray-100 shadow-sm transition-all duration-300 z-40 overflow-hidden flex flex-col">
      
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50 whitespace-nowrap">
        <Filter className="text-indigo-500 flex-shrink-0" size={24} />
        <h2 className="ml-4 font-bold text-gray-800 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Advance Filters
        </h2>
      </div>

      {/* Filter Content (Only visible on hover due to opacity) */}
      <div className="flex-1 overflow-y-auto p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        
        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
            <Tag size={18} className="text-gray-400" />
            <h3>Categories</h3>
          </div>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group/label">
                <input 
                  type="radio" 
                  name="category" 
                  value={cat}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  defaultChecked={cat === 'All'}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="text-sm text-gray-600 group-hover/label:text-indigo-600 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
            <SlidersHorizontal size={18} className="text-gray-400" />
            <h3>Max Price: ${price}</h3>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              onPriceChange(Number(e.target.value));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Ratings Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
            <Star size={18} className="text-gray-400" />
            <h3>Minimum Rating</h3>
          </div>
          <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-indigo-500">
            <option value="4">4 Stars & Up</option>
            <option value="3">3 Stars & Up</option>
            <option value="2">2 Stars & Up</option>
            <option value="all">Any Rating</option>
          </select>
        </div>

      </div>
    </aside>
  );
};

export default ProductSidebar;