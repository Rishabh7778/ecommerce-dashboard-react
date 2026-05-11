import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Search, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
// 🔥 Apne API hooks import karein
import { 
  useGetAllProductsQuery, 
  useGetCategoriesQuery, 
  useUpdateProductMutation 
} from '../services/productApi';

const UploadImageCard = () => {
  // --- API HOOKS ---
  // Assuming 'all' limit returns all products for easy local filtering
  const { data: productsData, isLoading: isLoadingProducts } = useGetAllProductsQuery({ limit: 'all' }); 
const { data: categories, isLoading: isLoadingCats } = useGetCategoriesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Image handling states
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safely extract products array
  const allProducts = Array.isArray(productsData) ? productsData : productsData?.products || [];

  // --- FILTER LOGIC ---
  const filteredProducts = allProducts.filter((p: any) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory ? p.category_id.toString() === selectedCategory : true;
    return matchSearch && matchCat;
  });

  // Jab product select ho, toh uski purani image dikhao
  useEffect(() => {
    if (selectedProduct) {
      // Agar multiple images hain comma separated, toh pehli wali dikhao
      const existingImg = selectedProduct.img ? selectedProduct.img.split(',')[0] : null;
      setPreviewImage(existingImg);
      setNewImageFile(null);
      setUpdateSuccess(false);
    } else {
      setPreviewImage(null);
    }
  }, [selectedProduct]);

  // --- HANDLERS ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      // File ko local URL mein convert karke preview dikhao
      setPreviewImage(URL.createObjectURL(file));
      setUpdateSuccess(false);
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedProduct || !newImageFile) return;

    try {
      const formData = new FormData();
      
      // 🔥 FIX: Product ki saari purani details ko wapas FormData mein append kar rahe hain
      // Taaki backend SQL query fail na ho
      Object.keys(selectedProduct).forEach((key) => {
        // 'img' aur custom category names ko chhod kar baaki sab daal do
        if (selectedProduct[key] !== null && selectedProduct[key] !== undefined && key !== 'images' && key !== 'category_name') {
          formData.append(key, selectedProduct[key]);
        }
      });

      // 🔥 Ab naya image file append karo
      formData.append('images', newImageFile);

      // Redux API Call
      await updateProduct({ id: selectedProduct.id, data: formData }).unwrap();
      
      setUpdateSuccess(true);
      setNewImageFile(null); // File clear kar do
      
      // 3 second baad success message hata do
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error: any) {
      console.error("Full Error Object:", error);
      // Ab error [object Object] nahi, balki asli error message dikhayega
      alert(`Update Failed! Error: ${error?.data?.error || error?.error || "Check console"}`);
    }
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full">
      <h3 className="text-gray-800 font-semibold mb-4">Quick Image Update</h3>

      {/* 1. SEARCH & CATEGORY FILTERS */}
      <div className="flex flex-col gap-3 mb-4">
     {/* CATEGORY SELECTOR */}
        <select 
          className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600 focus:outline-none disabled:bg-gray-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={isLoadingCats} // 🔥 FIX 1: API aane tak dropdown lock rahega
        >
          {/* 🔥 FIX 2: Text change hoga loading ke time */}
          <option value="">{isLoadingCats ? 'Loading Categories...' : 'All Categories'}</option>
          {categories?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="Search product to update..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-green-300"
          />
        </div>

        {/* 2. PRODUCT SELECTOR */}
       <select 
          className="w-full p-2.5 bg-gray-50 border border-green-100 rounded-lg text-sm text-gray-800 font-medium focus:outline-none focus:border-green-300 disabled:bg-gray-200"
          value={selectedProduct?.id || ''}
          onChange={(e) => {
            const product = filteredProducts.find((p: any) => p.id.toString() === e.target.value);
            setSelectedProduct(product || null);
          }}
          disabled={isLoadingProducts} // 🔥 API aane tak band rahega
        >
          {/* 🔥 Agar load ho raha hai toh Loading likha aayega */}
          <option value="">{isLoadingProducts ? 'Loading Products...' : '-- Select Product --'}</option>
          {filteredProducts.map((p: any) => (
            <option key={p.id} value={p.id}>{p.title} (₹{p.price})</option>
          ))}
        </select>
      </div>

      {/* 3. MAIN IMAGE UPLOAD AREA */}
      <div className={`relative bg-gray-50 border-2 border-dashed ${newImageFile ? 'border-green-400' : 'border-gray-200'} rounded-xl p-4 flex flex-col items-center justify-center mb-4 min-h-[200px] transition-colors`}>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageSelect} 
          accept="image/*" 
          className="hidden" 
        />

        {!selectedProduct ? (
           <div className="text-center text-gray-400 text-sm">
             Peese select a product above.
           </div>
        ) : previewImage ? (
          <>
            <img src={previewImage} alt="Preview" className="object-contain h-40 rounded-lg" />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
              >
                <UploadCloud size={14} /> {newImageFile ? 'Change File' : 'Browse New'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
             <ImageIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
             <p className="text-sm text-gray-500 font-medium">No image found</p>
             <p className="text-xs text-green-500 mt-1 hover:underline">Click to upload new</p>
          </div>
        )}
      </div>

      {/* 4. UPDATE BUTTON */}
      <div className="mt-auto">
        {updateSuccess ? (
          <div className="w-full py-2.5 bg-green-50 text-green-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Image Updated!
          </div>
        ) : (
          <button 
            disabled={!selectedProduct || !newImageFile || isUpdating}
            onClick={handleUpdateImage}
            className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all
              ${(!selectedProduct || !newImageFile) 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30'
              }`}
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save New Image'}
          </button>
        )}
      </div>

    </div>
  );
};

export default UploadImageCard;