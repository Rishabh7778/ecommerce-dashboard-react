import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, X, Plus, Save, Info, Tag, Box, Calendar, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2'; 

// API Hooks
import { useAddProductMutation, useUpdateProductMutation, useGetCategoriesQuery } from '../services/productApi';

const AddProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const editData = location.state?.editData; 

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: dbCategories, isLoading: isCatsLoading } = useGetCategoriesQuery();

  const isEditing = !!editData; 
  const isLoading = isAdding || isUpdating;

  // States
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '', 
    brand: '',
    price: 0,
    oldPrice: 0,
    sku: '',
    stockCount: 0,
    weight: '',
    mfgDate: '',
    expiryDate: '',
    badge: 'None',
    badgeColor: '#3BB77E',
    discount: 0,
    status: 'published' // 🔥 FIX 1
  });

  // --- LOAD EDIT DATA ---
  useEffect(() => {
    if (editData) {
      const formatDataDate = (dateString: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toISOString().split('T')[0];
      };

      setFormData({
        title: editData.title || '',
        description: editData.description || '',
        category_id: editData.category_id || '',
        brand: editData.brand || '',
        price: editData.price || 0,
        oldPrice: editData.oldPrice || 0,
        sku: editData.sku || '',
        stockCount: editData.stockCount || 0,
        weight: editData.weight || '',
        mfgDate: formatDataDate(editData.mfgDate),
        expiryDate: formatDataDate(editData.expiryDate),
        badge: editData.badge || 'None',
        badgeColor: editData.badgeColor || '#3BB77E',
        discount: editData.discount || 0,
        // 🔥 FIX 2: Agar purana 'active' hai toh usey 'published' maan lo
        status: (editData.status === 'active' ? 'published' : editData.status) || 'published'
      });

      if (editData.img) {
        setExistingImages(editData.img.split(','));
      }
    }
  }, [editData]);

  // --- AUTOMATIC DISCOUNT CALCULATION ---
  useEffect(() => {
    if (formData.oldPrice > 0 && formData.price > 0) {
      const disc = ((formData.oldPrice - formData.price) / formData.oldPrice) * 100;
      setFormData(prev => ({ ...prev, discount: Math.round(disc > 0 ? disc : 0) }));
    }
  }, [formData.price, formData.oldPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- IMAGE HANDLING ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
     setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category_id) {
        return Swal.fire('Error!', 'Bhai, Title, Price aur Category toh bharni hi padegi.', 'error');
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
          data.append(key, value.toString());
      });

      imageFiles.forEach((file) => {
          data.append('images', file); 
      });

      if (isEditing && existingImages.length > 0) {
          data.append('existingImage', existingImages.join(','));
      }

      if (isEditing) {
          await updateProduct({ id: editData.id, data: data }).unwrap(); 
          Swal.fire({ icon: 'success', title: 'Updated!', text: 'Product update ho gaya hai.', timer: 1500, showConfirmButton: false });
      } else {
          await addProduct(data).unwrap();
          Swal.fire({ icon: 'success', title: 'Mubarak Ho!', text: 'Product live ho gaya hai.', timer: 1500, showConfirmButton: false });
      }

      setTimeout(() => navigate('/admin/products'), 1500); 

    } catch (err: any) {
      console.error("Submission Error:", err);
      Swal.fire('Oops!', err.data?.message || 'Database mein dikat aa gayi!', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-[#253D4E]">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-extrabold text-gray-800">
            {isEditing ? `Edit Product: ${editData.title.slice(0, 15)}...` : 'Add New Product'}
         </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Info size={20} className="text-[#3BB77E]" /> General Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2">Product Title *</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} type="text" placeholder="e.g. NestFood Organic Brown Quinoa" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] focus:bg-white focus:border-[#3BB77E] outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Category *</label>
                  <select required name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]">
                    <option value="">{isCatsLoading ? 'Loading...' : 'Select Category'}</option>
                    {dbCategories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Brand</label>
                  <input name="brand" value={formData.brand} onChange={handleInputChange} type="text" placeholder="e.g. NestFood" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Product Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Product details..." className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Tag size={20} className="text-[#3BB77E]" /> Pricing & Stock
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">MRP (Old Price)</label>
                <input name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} type="number" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Selling Price *</label>
                <input required name="price" value={formData.price} onChange={handleInputChange} type="number" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
                {formData.discount > 0 && <span className="text-xs font-bold text-orange-500 mt-1 block">{formData.discount}% Discount</span>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Stock Count</label>
                <input name="stockCount" value={formData.stockCount} onChange={handleInputChange} type="number" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-bold mb-2">SKU ID</label>
                    <input name="sku" value={formData.sku} onChange={handleInputChange} type="text" placeholder="NF-001" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Weight</label>
                    <input name="weight" value={formData.weight} onChange={handleInputChange} type="text" placeholder="500g" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
                </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-[#3BB77E]" /> Important Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">MFG Date</label>
                <input name="mfgDate" value={formData.mfgDate} onChange={handleInputChange} type="date" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Expiry Date</label>
                <input name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} type="date" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Visibility</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none">
                    {/* 🔥 FIX 3: 'active' ko 'published' kar diya */}
                    <option value="published">Active / Published</option>
                    <option value="draft">Draft / Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-[#3BB77E] hover:bg-[#2fa06c] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
            {isLoading ? 'Processing...' : (isEditing ? 'Save Changes' : 'List Product on Dealport')}
          </button>
        </div>

        {/* --- RIGHT SIDE: MEDIA --- */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Box size={18} className="text-[#3BB77E]" /> Media & Badges
            </h3>
            
            <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#3BB77E] hover:bg-green-50 transition-all mb-6">
              <Upload className="text-gray-300 mb-2" size={32} />
              <span className="text-xs font-bold text-gray-500">Upload Product Images</span>
              <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>

            <div className="grid grid-cols-3 gap-2 mb-6">
              
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#3BB77E]/50 bg-gray-50" title="Existing Image">
                  <img src={url} alt="existing preview" className="w-full h-full object-contain p-1" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg">
                    <X size={12} />
                  </button>
                </div>
              ))}

              {previews.map((url, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={url} alt="new preview" className="w-full h-full object-contain p-1" />
                  <button type="button" onClick={() => removeNewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg">
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label className="border-2 border-dashed border-gray-100 rounded-xl aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-300">
                <Plus size={20} />
                <input type="file" multiple className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <div className="pt-6 border-t border-gray-50">
                <label className="block text-sm font-bold mb-2">Badge</label>
                <select name="badge" value={formData.badge} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#F8F9FA] outline-none mb-4">
                  <option value="None">None</option>
                  <option value="Hot">Hot</option>
                  <option value="Sale">Sale</option>
                  <option value="New">New</option>
                </select>
                <div className="flex items-center gap-3">
                    <input name="badgeColor" value={formData.badgeColor} onChange={handleInputChange} type="color" className="w-10 h-10 rounded-lg cursor-pointer border-none" />
                    <span className="text-xs text-gray-400 font-medium">Badge Color</span>
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;