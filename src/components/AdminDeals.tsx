import React, { useState } from 'react';
import { Plus, Trash2, X, Clock, ChevronRight, LayoutDashboard, Tag } from 'lucide-react';
import { 
    useGetDealsQuery, 
    useGetEligibleProductsQuery, 
    useAddDealFromProductMutation, 
    useDeleteDealMutation 
} from '../services/offerApi';

const AdminDeals = () => {
    // Queries
    const { data: dealsData, isLoading: isLoadingDeals } = useGetDealsQuery();
    const { data: productsData, isLoading: isLoadingProducts } = useGetEligibleProductsQuery();
    
    // Mutations
    const [addDealFromProduct] = useAddDealFromProductMutation();
    const [deleteDeal] = useDeleteDealMutation();

    const activeDeals = dealsData?.deals || [];
    const products = productsData?.products || [];

    // State for Modal
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [targetDate, setTargetDate] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');

    const openModal = (id: number) => {
        setSelectedProductId(id);
        setTargetDate('');
        setDiscountPercentage('');
    };

    const handleAddDeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId || !targetDate || !discountPercentage) return;

        // Convert datetime-local to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
        const mysqlDate = targetDate.replace('T', ' ') + ':00';

        try {
            await addDealFromProduct({ productId: selectedProductId, targetDate: mysqlDate, discountPercentage: Number(discountPercentage) }).unwrap();
            setSelectedProductId(null);
        } catch (error) {
            console.error("Failed to add deal", error);
            alert("Error adding deal");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <LayoutDashboard size={15} className="text-[#3BB77E]" />
                <span>Admin</span>
                <ChevronRight size={15} />
                <span className="flex items-center gap-1.5 text-[#253D4E]"><Tag size={14} className="text-[#3BB77E]" /> Deals of the Day</span>
            </nav>
            
            {/* --- SECTION 1: ACTIVE DEALS --- */}
            <section>
                <h1 className="text-2xl font-bold text-[#253D4E] mb-6">Active Deals of the Day</h1>
                {isLoadingDeals ? <p>Loading deals...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {activeDeals.map((deal: any) => {
                            // 🔥 FIX 1: Split string to get first image safely
                            const dealImage = deal.img ? deal.img.split(',')[0] : '';

                            return (
                                <div key={deal.id} className="border rounded-xl p-4 shadow-sm bg-white relative">
                                    <button 
                                        onClick={() => deleteDeal(deal.id)} 
                                        className="absolute top-2 right-2 text-red-500 bg-red-50 p-1.5 rounded-full hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    
                                    {/* Updated Image Tag */}
                                    <img src={dealImage} alt={deal.title} className="w-full h-32 object-cover rounded-md mb-3 bg-gray-50" />
                                    
                                    <h3 className="font-bold text-sm line-clamp-1">{deal.title}</h3>
                                    <p className="text-[#3BB77E] font-bold mt-1">₹{Number(deal.price).toFixed(2)} <span className="line-through text-gray-400 text-xs">₹{Number(deal.oldPrice).toFixed(2)}</span> <span className="text-xs text-red-500">{deal.discountPercentage}% off</span></p>
                                    <div className="mt-2 text-xs flex items-center gap-1 text-orange-500 font-medium bg-orange-50 p-1.5 rounded">
                                        <Clock size={14} /> Ends: {new Date(deal.targetDate).toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <hr />

            {/* --- SECTION 2: ADD NEW DEAL FROM PRODUCTS --- */}
            <section>
                <h2 className="text-xl font-bold text-[#253D4E] mb-6">Select a Product to Make a Deal</h2>
                {isLoadingProducts ? <p>Loading products...</p> : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="p-4 border-b">Image</th>
                                    <th className="p-4 border-b">Product Title</th>
                                    <th className="p-4 border-b">Category</th>
                                    <th className="p-4 border-b">Price</th>
                                    <th className="p-4 border-b text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((prod: any) => {
                                    // Check if product is already a deal
                                    const isAlreadyDeal = activeDeals.some((d: any) => d.title === prod.title);
                                    
                                    // 🔥 FIX 2: Split string to get first image safely
                                    const prodImage = prod.img ? prod.img.split(',')[0] : '';

                                    return (
                                        <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 border-b">
                                                {/* Updated Image Tag */}
                                                <img src={prodImage} alt="img" className="w-12 h-12 object-cover rounded bg-gray-50" />
                                            </td>
                                            <td className="p-3 border-b font-medium text-sm">{prod.title}</td>
                                            <td className="p-3 border-b text-sm text-gray-500">
                                                <span className="bg-gray-200 px-2 py-1 rounded text-xs">{prod.category_name || 'Uncategorized'}</span>
                                            </td>
                                            <td className="p-3 border-b text-sm font-bold">${prod.price}</td>
                                            <td className="p-3 border-b text-center">
                                                {isAlreadyDeal ? (
                                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-bold">Active Deal</span>
                                                ) : (
                                                    <button 
                                                        onClick={() => openModal(prod.id)} 
                                                        className="bg-[#3BB77E] text-white p-2 rounded hover:bg-[#2e9c68]"
                                                        title="Make Deal of the Day"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* --- MODAL: SELECT TIME --- */}
            {selectedProductId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Clock size={18}/> Set Deal Expiry</h2>
                            <button onClick={() => setSelectedProductId(null)} className="text-gray-500 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddDeal} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    value={targetDate} 
                                    onChange={(e) => setTargetDate(e.target.value)} 
                                    required 
                                    className="w-full border rounded p-2 focus:ring-[#3BB77E] outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Discount (%)</label>
                                <input type="number" min="1" max="99" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} required placeholder="e.g. 20" className="w-full border rounded p-2 focus:ring-[#3BB77E] outline-none" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setSelectedProductId(null)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#3BB77E] text-white rounded hover:bg-[#2e9c68]">Start Deal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDeals;
