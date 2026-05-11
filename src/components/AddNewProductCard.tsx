import React from 'react';
import { PlusCircle, ChevronRight, Smartphone, Shirt, Home as HomeIcon } from 'lucide-react';

const AddNewProductCard = () => {
  const categories = [
    { name: 'Electronic', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Fashion', icon: Shirt, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Home', icon: HomeIcon, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const recentProducts = [
    { name: 'Smart Fitness Tracker', price: '$29.99', img: '⌚' },
    { name: 'Leather Wallet', price: '$19.99', img: '👝' },
    { name: 'Electric Hair Trimmer', price: '$34.99', img: '🔌' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 font-semibold">Add New Product</h3>
        <button className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600">
          <PlusCircle size={14} /> Add New
        </button>
      </div>

      {/* Categories List */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-medium mb-3">Categories</p>
        <div className="flex flex-col gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                  <cat.icon size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
        <button className="w-full text-center mt-3 text-xs text-indigo-500 font-medium hover:underline">
          See more
        </button>
      </div>

      {/* Recent Product List */}
      <div className="mt-auto">
        <p className="text-xs text-gray-400 font-medium mb-3">Product</p>
        <div className="flex flex-col gap-4">
          {recentProducts.map((prod, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl border border-gray-100">
                  {prod.img}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{prod.name}</h4>
                  <p className="text-xs font-bold text-green-500">{prod.price}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors flex items-center gap-1">
                <PlusCircle size={12} /> Add
              </button>
            </div>
          ))}
        </div>
         <button className="w-full text-center mt-4 text-xs text-indigo-500 font-medium hover:underline">
          See more
        </button>
      </div>

    </div>
  );
};

export default AddNewProductCard;