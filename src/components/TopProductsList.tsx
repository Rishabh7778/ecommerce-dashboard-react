import  { useState } from 'react';
import { Search, Loader2, Package } from 'lucide-react';
import { useGetDashboardStatsQuery } from '../services/productApi';

const TopProductsList = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  // Backend se aaya hua Top Products ka data
  const topProducts = stats?.topProducts || [];

  // 🔥 Search Filter Logic (Jo bhi search box mein type hoga, us hisaab se filter karega)
  const filteredProducts = topProducts.filter((product: any) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-semibold">Top Products</h3>
        <a href="#" className="text-xs text-green-500 font-medium hover:underline">All products</a>
      </div>

      {/* 🔥 Functional Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Search state update
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-green-300 focus:bg-white transition-all"
        />
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
        
        {isLoading ? (
           <div className="flex justify-center py-6"><Loader2 className="animate-spin text-green-500" /></div>
        ) : filteredProducts.length === 0 ? (
           <div className="text-center text-sm text-gray-400 py-6">No products found.</div>
        ) : (
          filteredProducts.map((product: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                {/* Agar database se image (img) aati hai toh wo dikhayenge, 
                  warna default ek icon dikhayenge 
                */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden border border-gray-200">
                  {product.img ? (
                    <img src={product.img.split(',')[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="text-gray-400" size={20} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-1" title={product.name}>
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Item: {product.id || `SKU-00${idx + 1}`}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-gray-800">₹{Number(product.price).toFixed(2)}</span>
                <span className="text-[10px] text-green-500 font-bold">{product.total_sold} Sold</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProductsList;