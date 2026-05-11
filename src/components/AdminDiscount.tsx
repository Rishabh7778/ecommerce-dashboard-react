import React, { useState, useMemo } from 'react';
import { useGetCategoriesQuery, useApplyCategoryDiscountMutation, useRemoveCategoryDiscountMutation } from '../services/discountApi'; 
// 🔥 Products fetch karne ke liye import add kiya hai
import { useGetAllProductsQuery } from '../services/productApi'; 
import { Tag, Percent, Loader2, Trash2, CalendarDays, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminDiscount = () => {
    // API Hooks
    const { data: categories, isLoading: isFetching } = useGetCategoriesQuery();
    const { data: productsData } = useGetAllProductsQuery({ limit: 'all' });
    
    const [applyDiscount, { isLoading: isApplying }] = useApplyCategoryDiscountMutation();
    const [removeDiscount, { isLoading: isRemoving }] = useRemoveCategoryDiscountMutation();

    const [formData, setFormData] = useState({
        categoryId: '', discount: '', startDate: '', expiryDate: ''
    });

    // 1. Sirf wahi categories nikalo jinpar discount laga hai
    const activeDiscounts = Array.isArray(categories) 
        ? categories.filter((cat: any) => cat.discount_percentage > 0) 
        : [];

    // 2. All Products extract karo
    const allProducts = useMemo(() => 
        Array.isArray(productsData) ? productsData : productsData?.products || [], 
    [productsData]);

    // 3. Selected category aur uske products preview ke liye nikalna
    const selectedCategory = categories?.find((c: any) => c.id.toString() === formData.categoryId);
    
    // Preview ke liye sirf max 3 products dikhayenge
    const previewProducts = useMemo(() => {
        if (!selectedCategory) return [];
        return allProducts
            // Backend format ke hisaab se id ya name match karo
            .filter((p: any) => p.category_id?.toString() === selectedCategory.id.toString() || p.category_name === selectedCategory.name)
            .slice(0, 3); // Sirf 3 products ka sample preview
    }, [allProducts, selectedCategory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await applyDiscount(formData).unwrap();
            Swal.fire("Success", "Bulk Category Discount apply ho gaya!", "success");
            setFormData({ categoryId: '', discount: '', startDate: '', expiryDate: '' });
        } catch (err: any) {
            Swal.fire("Error", err.data?.message || "Something went wrong", "error");
        }
    };

    const handleRemoveDiscount = async (id: number, name: string) => {
        const confirm = await Swal.fire({
            title: `Remove discount from ${name}?`,
            text: "Is category ke sabhi products wapas purane price par aa jayenge.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!"
        });

        if (confirm.isConfirmed) {
            try {
                await removeDiscount(id).unwrap();
                Swal.fire("Removed!", "Category discount hata diya gaya hai.", "success");
            } catch (error: any) {
                Swal.fire("Error", "Discount hatane mein problem aayi.", "error");
            }
        }
    };

    if (isFetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-500 w-10 h-10" /></div>;

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* 1. APPLY DISCOUNT FORM */}
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Tag className="text-[#3BB77E]" size={32} />
                        <div>
                           <h1 className="text-2xl font-bold text-gray-800">Apply Category Discount</h1>
                           <p className="text-xs text-gray-400">Discount will automatically apply to all products inside the category.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: Inputs */}
                        <div className="lg:col-span-7 space-y-5">
                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-400 uppercase tracking-wider">Select Category</label>
                                <select 
                                    required
                                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#3BB77E] transition-all cursor-pointer text-sm font-semibold text-gray-700"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                >
                                    <option value="">Choose a category...</option>
                                    {categories?.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1.5 text-gray-400 uppercase tracking-wider">Start Date</label>
                                    <input 
                                        required type="datetime-local" 
                                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#3BB77E] text-sm text-gray-700 font-medium"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1.5 text-gray-400 uppercase tracking-wider">Expiry Date</label>
                                    <input 
                                        required type="datetime-local" 
                                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#3BB77E] text-sm text-gray-700 font-medium"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1.5 text-gray-400 uppercase tracking-wider">Discount Percentage (%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        required type="number" min="1" max="99" placeholder="Eg: 20"
                                        className="w-full pl-11 p-3.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[#3BB77E] text-lg font-bold text-gray-800"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live Price Preview */}
                        <div className="lg:col-span-5 flex flex-col">
                           <label className="block text-xs font-bold mb-1.5 text-gray-400 uppercase tracking-wider flex items-center gap-1">
                               <Eye size={14} /> Live Sample Preview
                           </label>
                           
                           <div className={`flex-1 rounded-2xl border-2 border-dashed transition-all duration-500 overflow-hidden flex flex-col
                              ${(selectedCategory && formData.discount) ? 'bg-[#e8f5e9] border-[#a5d6a7] p-5' : 'bg-gray-50 border-gray-200 items-center justify-center p-8'}`}>
                                
                                {!(selectedCategory && formData.discount) ? (
                                    <div className="text-center text-gray-400 opacity-60">
                                       <Tag size={32} className="mx-auto mb-2" />
                                       <p className="text-sm font-medium">Select a category and enter discount<br/>to see live price changes.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="pb-3 border-b border-[#c8e6c9]">
                                           <h3 className="text-sm font-bold text-green-800">Preview: {selectedCategory.name}</h3>
                                           <p className="text-[10px] text-green-600 font-semibold uppercase mt-1">Applying {formData.discount}% OFF on all items</p>
                                        </div>

                                        {previewProducts.length === 0 ? (
                                            <p className="text-sm text-green-700 italic">No products currently found in this category to preview.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {previewProducts.map((p: any) => {
                                                    const original = Number(p.price);
                                                    const discountAmt = original * (Number(formData.discount) / 100);
                                                    const newPrice = original - discountAmt;

                                                    return (
                                                        <div key={p.id} className="flex items-center justify-between bg-white/60 p-2.5 rounded-lg">
                                                            <span className="text-xs font-bold text-gray-700 truncate w-32" title={p.title}>{p.title}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-gray-400 line-through">₹{original.toFixed(2)}</span>
                                                                <span className="text-sm font-black text-[#3BB77E]">₹{newPrice.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {/* Hint indicator if there are more products */}
                                                <p className="text-[10px] text-green-600 text-center font-semibold pt-1">+ and all other items in this category</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                           </div>
                        </div>

                        {/* Submit Button */}
                        <div className="lg:col-span-12 mt-2">
                            <button 
                                type="submit" disabled={isApplying || !formData.categoryId || !formData.discount}
                                className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2
                                    ${(formData.categoryId && formData.discount) 
                                        ? 'bg-[#3BB77E] hover:bg-[#2fa06c] text-white' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                            >
                                {isApplying ? <Loader2 className="animate-spin" size={24} /> : "Apply Bulk Category Discount"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. ACTIVE DISCOUNTS CARDS */}
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <h2 className="text-xl font-bold text-[#253D4E] mb-6 border-b border-gray-100 pb-4">Currently Active Category Discounts</h2>
                    
                    {activeDiscounts.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                           <p className="text-gray-400 font-medium text-sm">Abhi kisi bhi category par bulk discount nahi laga hai.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {activeDiscounts.map((cat: any) => (
                                <div key={cat.id} className="border border-green-100 bg-green-50/50 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{cat.name}</h3>
                                            <span className="inline-flex mt-1.5 bg-red-100 text-red-600 border border-red-200 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                {cat.discount_percentage}% OFF
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveDiscount(cat.id, cat.name)}
                                            disabled={isRemoving}
                                            className="p-2 bg-white text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100"
                                            title="Remove Entire Category Discount"
                                        >
                                            {isRemoving ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                    <div className="text-[11px] text-gray-500 space-y-1.5 bg-white p-3 rounded-xl border border-gray-100">
                                        <p className="flex items-center gap-1.5"><CalendarDays size={14} className="text-green-500"/> <strong>Starts:</strong> <span className="text-gray-800 font-medium">{new Date(cat.discount_start_date).toLocaleString()}</span></p>
                                        <p className="flex items-center gap-1.5"><CalendarDays size={14} className="text-red-400"/> <strong>Expires:</strong> <span className="text-gray-800 font-medium">{new Date(cat.discount_expiry_date).toLocaleString()}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDiscount;