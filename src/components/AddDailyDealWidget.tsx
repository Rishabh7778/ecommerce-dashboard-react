import { useState, useMemo } from 'react';
import { Tag, Loader2, CheckCircle2, ChevronDown, Percent, IndianRupee, Trash2, List } from 'lucide-react';
import { useGetAllProductsQuery, useUpdateProductMutation } from '../services/productApi';

const AddDailyDealWidget = () => {
  const { data: productsData, isLoading } = useGetAllProductsQuery({ limit: 'all' });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [selectedProductId, setSelectedProductId] = useState('');
  const [discount, setDiscount] = useState('');
  const [success, setSuccess] = useState(false);

  // 1. All Products
  const allProducts = useMemo(() => 
    Array.isArray(productsData) ? productsData : productsData?.products || [], 
  [productsData]);

  // 2. Sirf wo products jinpar discount > 0 hai (Active Deals)
  const activeDeals = useMemo(() => 
    allProducts.filter((p: any) => Number(p.discount) > 0),
  [allProducts]);

  const selectedProduct = allProducts.find((p: any) => p.id.toString() === selectedProductId);

  // 🔥 Professional Price Calculation
  const discountedPrice = useMemo(() => {
    if (!selectedProduct || !discount) return 0;
    const original = Number(selectedProduct.price);
    const perc = Number(discount);
    return original - (original * (perc / 100));
  }, [selectedProduct, discount]);

  // --- HANDLER: Apply Discount ---
  const handleApplyDeal = async () => {
    if (!selectedProduct || !discount) return;

    try {
      const formData = new FormData();
      
      Object.keys(selectedProduct).forEach((key) => {
        if (selectedProduct[key] !== null && selectedProduct[key] !== undefined && key !== 'img' && key !== 'category_name') {
          formData.append(key, selectedProduct[key]);
        }
      });

      formData.set('discount', discount);
      formData.set('badge', 'Daily Deal');
      formData.set('badgeColor', '#3BB77E'); 

      if (selectedProduct.img) {
          formData.append('existingImage', selectedProduct.img);
      }

      await updateProduct({ id: selectedProduct.id, data: formData }).unwrap();
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedProductId('');
        setDiscount('');
      }, 2500);

    } catch (error) {
      console.error("Deal Update Error:", error);
    }
  };

  // --- HANDLER: Remove Discount ---
  const handleRemoveDeal = async (product: any) => {
    if (window.confirm(`Are you sure you want to remove the deal from ${product.title}?`)) {
      try {
        const formData = new FormData();
        
        Object.keys(product).forEach((key) => {
          if (product[key] !== null && product[key] !== undefined && key !== 'img' && key !== 'category_name') {
            formData.append(key, product[key]);
          }
        });

        // 🔥 Discount wapas 0 kar diya
        formData.set('discount', '0');
        formData.set('badge', 'None');

        if (product.img) {
            formData.append('existingImage', product.img);
        }

        await updateProduct({ id: product.id, data: formData }).unwrap();
      } catch (error) {
        console.error("Failed to remove deal:", error);
        alert("Failed to remove deal!");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full transition-all max-h-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
            <Tag size={20} className="text-[#3BB77E]" /> Manage Daily Deals
          </h3>
          <p className="text-xs text-gray-400">Set special pricing for specific products.</p>
        </div>
      </div>

      {/* 1. SELECTION AREA */}
      <div className="relative mb-4">
        <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1.5 block">Select Product</label>
        <div className="relative">
          <select 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-[#3BB77E] transition-all cursor-pointer"
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setDiscount(''); 
            }}
            disabled={isLoading}
          >
            <option value="">{isLoading ? 'Fetching database...' : 'Click to choose a product'}</option>
            {allProducts.map((p: any) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* 2. DYNAMIC DETAILS (Sirf tab dikhega jab product select hoga) */}
      <div className={`overflow-hidden transition-all duration-500 ${selectedProduct ? 'max-h-[500px] opacity-100 mt-2 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
        {selectedProduct && (
          <div className="space-y-5">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1.5 block">Set Discount Percentage</label>
              <div className="relative">
                <input 
                  type="number" 
                  max="99"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-[#3BB77E]"
                />
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200">
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Price Update Preview</p>
               <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 line-through font-medium">Original: ₹{selectedProduct.price}</span>
                    <span className="text-2xl font-black text-[#253D4E]">
                      ₹{discount ? discountedPrice.toFixed(2) : selectedProduct.price}
                    </span>
                  </div>
                  {discount && (
                    <div className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                      -{discount}% OFF
                    </div>
                  )}
               </div>
            </div>

            <button 
              onClick={handleApplyDeal}
              disabled={!discount || isUpdating}
              className={`w-full py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg
                ${success 
                  ? 'bg-green-500 text-white shadow-green-200' 
                  : 'bg-[#253D4E] text-white hover:bg-black shadow-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none'
                }`}
            >
              {isUpdating ? <Loader2 size={18} className="animate-spin" /> : success ? <><CheckCircle2 size={18} /> Deal Updated Successfully!</> : <><IndianRupee size={18} /> Update Pricing & Badge</>}
            </button>
          </div>
        )}
      </div>

      {!selectedProduct && !isLoading && activeDeals.length === 0 && (
        <div className="mt-4 py-8 border-2 border-dashed border-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <Tag size={20} className="text-gray-300" />
           </div>
           <p className="text-xs text-gray-400 font-medium">No product selected.<br/>Choose one to edit pricing.</p>
        </div>
      )}

      {/* =========================================
          PART 3: ACTIVE DEALS LIST (Scrollable)
      ========================================== */}
      <div className="mt-4 flex-1 flex flex-col min-h-0 border-t border-gray-100 pt-4">
        <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <List size={14} /> Active Deals ({activeDeals.length})
        </h4>

        <div className="overflow-y-auto pr-2 pb-2 space-y-3" style={{ scrollbarWidth: 'thin', maxHeight: '220px' }}>
          {activeDeals.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-4 bg-gray-50 rounded-xl">No active deals running.</p>
          )}
          
          {activeDeals.map((deal: any) => {
            const currentDealPrice = deal.price - (deal.price * (deal.discount / 100));
            
            return (
              <div key={deal.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img 
                    src={deal.img ? deal.img.split(',')[0] : 'https://via.placeholder.com/50'} 
                    alt="thumbnail" 
                    className="w-10 h-10 object-cover rounded-lg bg-gray-50 border border-gray-100"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[140px] sm:max-w-[180px]">{deal.title}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#3BB77E] font-black">₹{currentDealPrice.toFixed(2)}</span>
                      <span className="text-gray-400 line-through">₹{deal.price}</span>
                      <span className="text-red-500 font-bold bg-red-50 px-1 rounded">-{deal.discount}%</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemoveDeal(deal)}
                  disabled={isUpdating}
                  title="Remove Discount"
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AddDailyDealWidget;