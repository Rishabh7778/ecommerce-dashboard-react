import { useState, useMemo } from 'react';
import { ShoppingCart, Star, Grid, List as ListIcon, Filter, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

// APIs import karein
import { useGetAllProductsQuery } from '../services/productApi';
import { useGetCategoriesQuery } from '../services/discountApi'; 

// Category icons
const categoryIcons = ['🥤', '🍟', '🥩', '🍦', '🍳', '🍚', '🌶️', '💄', '🧼', '🍼', '💊', '🍪', '☕', '🍫', '🔪', '🛁', '📎', '🥫'];

// Dummy new products for bottom left sidebar
const newProducts = [
  { name: 'Chen Cardigan', price: 99.50, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=100&q=80' },
  { name: 'Chen Sweater', price: 89.50, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=100&q=80' },
];

const ShopPage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 🔥 FILTER & PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12); // Ab ye State hai (Dropdown se change hoga)
  const [sortBy, setSortBy] = useState('featured'); // Default sorting state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API Calls (Limit aur Page pass kar rahe hain)
  const { data: responseData, isLoading: isProductsLoading, error } = useGetAllProductsQuery({ 
      page: currentPage, 
      limit: productsPerPage 
  });
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  // 🔥 DATA EXTRACTION
  const rawProducts = responseData?.products || [];
  const paginationData = responseData?.pagination;

  // Active products filter & Category filter
  const filteredProducts = useMemo(() => {
    let active = rawProducts.filter((p: any) => p.status === 'active' || p.status === 'published');
    if (selectedCategory) {
        active = active.filter((p: any) => p.category_id === selectedCategory);
    }
    return active;
  }, [rawProducts, selectedCategory]);


  // 🔥 SMART SORTING LOGIC (With Price Calculation)
  const sortedProducts = useMemo(() => {
    // 1. Pehle sabka exact price calculate kar lo
    const processedProducts = filteredProducts.map((product: any) => {
        const originalPrice = Number(product.price);
        const activeDiscountPercentage = Number(product.discount_percentage || product.discount || 0);
        
        let currentPrice = originalPrice;
        let hasDiscount = false;

        if (activeDiscountPercentage > 0) {
            currentPrice = originalPrice - (originalPrice * (activeDiscountPercentage / 100));
            hasDiscount = true;
        } else if (product.discounted_price && product.discounted_price < originalPrice) {
            currentPrice = Number(product.discounted_price);
            hasDiscount = true;
        }
        
        return { ...product, originalPrice, currentPrice, hasDiscount, activeDiscountPercentage };
    });

    // 2. Ab user ki choice ke hisaab se sort karo
    return [...processedProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.currentPrice - b.currentPrice;
        if (sortBy === 'price-high') return b.currentPrice - a.currentPrice;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // 'featured' (Default API order)
    });
  }, [filteredProducts, sortBy]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans flex flex-col lg:flex-row gap-8">
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <span className="font-bold text-gray-800">We found {sortedProducts.length} items for you!</span>
        <button 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* LEFT SIDEBAR */}
      <aside className={`w-full lg:w-1/4 flex flex-col gap-8 ${showMobileSidebar ? 'block' : 'hidden lg:flex'}`}>
        
        {/* Categories Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative">
          <h3 className="text-xl font-bold text-[#253D4E] mb-6 relative pb-2 border-b border-gray-100">
            Category
            <span className="absolute bottom-[-1px] left-0 w-12 h-[2px] bg-green-500"></span>
          </h3>
          
          {isCategoriesLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-green-500" /></div>
          ) : (
            <ul className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }`}</style>
              
              <li 
                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                className={`flex justify-between items-center p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedCategory === null ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:border-green-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <span className={`text-sm font-bold ${selectedCategory === null ? 'text-green-600' : 'text-gray-600'}`}>All Products</span>
                </div>
              </li>

              {categories.map((cat: any, idx: number) => (
                  <li 
                    key={cat.id} 
                    onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                    className={`flex justify-between items-center p-2.5 rounded-lg border cursor-pointer transition-all group ${
                      selectedCategory === cat.id ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:border-green-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryIcons[idx % categoryIcons.length]}</span>
                      <span className={`text-sm ${selectedCategory === cat.id ? 'text-green-600 font-bold' : 'text-gray-600 font-medium group-hover:text-green-600'}`}>
                        {cat.name}
                      </span>
                    </div>
                  </li>
              ))}
            </ul>
          )}
        </div>

        {/* Trending Now Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative hidden lg:block">
          <h3 className="text-xl font-bold text-[#253D4E] mb-6 relative pb-2 border-b border-gray-100">
            Trending Now
            <span className="absolute bottom-[-1px] left-0 w-12 h-[2px] bg-green-500"></span>
          </h3>
          <div className="flex flex-col gap-4">
            {newProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img src={prod.img} alt={prod.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                <div>
                  <h4 className="text-sm font-bold text-[#3BB77E] cursor-pointer mb-1">{prod.name}</h4>
                  <p className="text-sm font-bold text-gray-400">${prod.price.toFixed(2)}</p>
                  <div className="flex text-yellow-400 mt-1"><Star size={12} fill="currentColor" strokeWidth={0} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <div className="w-full lg:w-3/4 flex flex-col">
        
        {/* 🔥 TOP ACTION BAR (SORTING & LIMIT FILTERS) 🔥 */}
        <div className="hidden lg:flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 mb-6 shadow-sm">
          <p className="text-gray-500 font-medium text-sm">
             We found <strong className="text-green-500">{sortedProducts.length}</strong> items on this page!
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setIsGridView(true)} className={`p-1.5 rounded-md transition-colors ${isGridView ? 'bg-white shadow-sm text-green-500' : 'text-gray-500'}`}><Grid size={18} /></button>
              <button onClick={() => setIsGridView(false)} className={`p-1.5 rounded-md transition-colors ${!isGridView ? 'bg-white shadow-sm text-green-500' : 'text-gray-500'}`}><ListIcon size={18} /></button>
            </div>
            
            {/* Show Limit Dropdown */}
            <div className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
              <Grid size={14} className="text-gray-400"/>
              <span className="font-medium text-gray-500">Show:</span>
              <select 
                value={productsPerPage} 
                onChange={(e) => {
                   setProductsPerPage(Number(e.target.value));
                   setCurrentPage(1); // Reset page on limit change
                }}
                className="bg-transparent outline-none cursor-pointer appearance-none pr-4 font-bold text-gray-800"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"/>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
              <ListIcon size={14} className="text-gray-400"/>
              <span className="font-medium text-gray-500">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none cursor-pointer appearance-none pr-4 font-bold text-gray-800"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"/>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isProductsLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 w-full bg-red-50 rounded-xl border border-red-200 text-red-500 font-bold">Failed to load products.</div>
        ) : sortedProducts.length === 0 ? (
           <div className="flex flex-col justify-center items-center h-64 w-full bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-400 font-bold text-lg mb-2">No products found.</span>
            <button onClick={() => { setSelectedCategory(null); setSortBy('featured'); }} className="text-green-500 hover:underline">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5" : "flex flex-col gap-5"}>
              {/* 🔥 Mapped over SORTED array instead of filtered */}
              {sortedProducts.map((product:any) => (
                  <div key={product.id} className={`group relative bg-white border border-gray-200 rounded-2xl hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden ${isGridView ? 'p-4 flex flex-col h-full' : 'p-4 flex flex-col sm:flex-row items-center gap-6'}`}>
                    
                    {/* Discount/Badge */}
                    {product.activeDiscountPercentage > 0 ? (
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-br-2xl z-10">
                        {product.activeDiscountPercentage}% OFF
                      </span>
                    ) : product.badge ? (
                      <span className={`absolute top-0 left-0 ${product.badgeColor || 'bg-green-500'} text-white text-[10px] font-bold px-3 py-1.5 rounded-br-2xl z-10`}>
                        {product.badge}
                      </span>
                    ) : null}

                    {/* Image */}
                    <div onClick={() => navigate(`/product/${product.id}`)} className={`relative flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden cursor-pointer ${isGridView ? 'w-full h-48 mb-4' : 'w-full sm:w-48 h-48 flex-shrink-0'}`}>
                      <img src={product.img?.split(',')[0]} alt={product.title} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 w-full">
                      <span className="text-[11px] text-gray-400 mb-1 block">{product.category_name}</span>
                      <h3 onClick={() => navigate(`/product/${product.id}`)} className="text-[15px] font-bold text-[#253D4E] hover:text-[#3BB77E] cursor-pointer leading-snug mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating || 0) ? 0 : 2} className={i >= Math.floor(product.rating || 0) ? "text-gray-300" : ""} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">({(product.rating || 0).toFixed(1)})</span>
                      </div>

                      <p className={`text-xs text-gray-400 ${isGridView ? 'mb-4 mt-auto' : 'mb-4'}`}>
                        By <span className="text-green-500 cursor-pointer">{product.brand}</span>
                      </p>

                      <div className={`flex flex-col ${isGridView ? 'mt-auto' : 'mt-auto w-full sm:w-auto'}`}>
                        <div className="flex items-end justify-between gap-2">
                          <span className="text-lg font-bold text-green-500">
                            ${product.currentPrice.toFixed(2)}
                          </span>
                          
                          {product.hasDiscount ? (
                            <span className="text-sm font-medium text-gray-400 line-through mb-0.5">${product.originalPrice.toFixed(2)}</span>
                          ) : product.oldPrice ? (
                            <span className="text-sm font-medium text-gray-400 line-through mb-0.5">${Number(product.oldPrice).toFixed(2)}</span>
                          ) : null}
                        </div>

                        <button 
                          className="bg-green-50 hover:bg-green-500 text-green-600 hover:text-white px-4 py-2 rounded-md flex items-center gap-2 font-bold text-xs transition-colors shadow-sm mt-2"
                          onClick={() => dispatch(addToCart({
                            ...product,
                            id: product.id!, 
                            price: product.currentPrice,
                            img: product.img?.split(',')[0] || '' 
                          }))}
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* 🔥 PAGINATION CONTROLS */}
            {paginationData && paginationData.totalPages > 1 && (
              <div className="flex justify-between items-center mt-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  Showing Page <strong className="text-gray-800">{paginationData.page}</strong> of <strong className="text-gray-800">{paginationData.totalPages}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(paginationData.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          currentPage === pageNum 
                            ? 'bg-green-500 text-white shadow-md shadow-green-100 border-green-500' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
                    disabled={currentPage === paginationData.totalPages}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;