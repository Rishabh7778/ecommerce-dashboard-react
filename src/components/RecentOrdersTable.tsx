import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, MoreHorizontal, Loader2, Package } from 'lucide-react';
import { useGetAllOrdersAdminQuery } from '../services/orderApi'; // 🔥 API import ki

// Delivery Status ke hisaab se badge color set karega
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-semibold capitalize">{status}</span>;
    case 'processing': return <span className="px-2 py-1 bg-orange-50 text-orange-500 rounded-md text-xs font-semibold capitalize">{status}</span>;
    case 'shipped': return <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold capitalize">{status}</span>;
    case 'cancelled': return <span className="px-2 py-1 bg-red-50 text-red-500 rounded-md text-xs font-semibold capitalize">{status}</span>;
    default: return <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-xs font-semibold capitalize">{status || 'Unknown'}</span>;
  }
};

const RecentOrdersTable = () => {
  // 🔥 Backend se data mangwa rahe hain
  const { data, isLoading, error } = useGetAllOrdersAdminQuery();
  const orders = data?.orders || [];

  // Tab filtering ke liye state
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 🔥 Filter Logic (Tab aur Search dono ke liye)
  const filteredOrders = orders.filter((order: any) => {
    // Tab Filter
    const matchesTab = 
        activeTab === 'All' ? true :
        activeTab === 'Completed' ? order.delivery_status === 'delivered' :
        activeTab === 'Pending' ? order.delivery_status === 'processing' :
        activeTab === 'Canceled' ? order.delivery_status === 'cancelled' : true;

    // Search Filter (Order ID, Product Name, ya User Name se)
    const matchesSearch = 
        order.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.products?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-500 w-8 h-8" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-bold py-10">Failed to load recent orders.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col overflow-hidden">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        
        {/* Interactive Tabs */}
        <div className="flex items-center bg-gray-50 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'All' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            All order ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('Completed')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'Completed' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setActiveTab('Pending')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'Pending' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveTab('Canceled')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'Canceled' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Canceled
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-green-300" 
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-50"><Filter size={16} /></button>
          <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-50"><ArrowUpDown size={16} /></button>
          <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-50"><MoreHorizontal size={16} /></button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 bg-green-50/50 uppercase border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-4 py-3 font-semibold">No.</th>
              <th className="px-4 py-3 font-semibold">Order Id</th>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold rounded-tr-lg">Status</th>
            </tr>
          </thead>
         <tbody>
            {filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400 font-medium">No matching orders found.</td>
                </tr>
            ) : (
                filteredOrders.map((order: any, idx: number) => {
                    const isPaid = order.status === 'success';

                    // 🔥 FIX: Products ko '||' se tod kar ek array bana lo
                    const productList = order.products 
                        ? order.products.split('||').filter((p: string) => p.trim() !== '') 
                        : ['Items package'];

                    return (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-4 align-top"><input type="checkbox" className="rounded border-gray-300 cursor-pointer mt-3" /></td>
                            
                            <td className="px-4 py-4 text-gray-500 align-top pt-6">{idx + 1}</td>
                            
                            <td className="px-4 py-4 font-medium text-gray-800 align-top pt-6" title={order.order_id}>
                                #ORD-{order.id}
                            </td>
                            
                            {/* 🔥 ALAG-ALAG PRODUCTS DIKHANE WALA HISSA */}
                            <td className="px-4 py-4">
                                <div className="flex flex-col gap-3">
                                    {productList.map((prodName: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-xl bg-green-50 p-1.5 rounded-lg text-green-600 shadow-sm">
                                                <Package size={16}/>
                                            </span>
                                            <span className="font-medium text-gray-800 break-words max-w-[200px] leading-snug">
                                                {prodName.trim()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            
                            <td className="px-4 py-4 text-gray-500 whitespace-nowrap align-top pt-6">
                                {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </td>
                            
                            <td className="px-4 py-4 font-bold text-[#3BB77E] text-base align-top pt-6">
                                ${Number(order.amount).toFixed(2)}
                            </td>
                            
                            <td className="px-4 py-4 align-top pt-6">
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className={isPaid ? 'text-green-600' : 'text-red-600'}>{isPaid ? 'Paid' : 'Unpaid'}</span>
                                </div>
                            </td>
                            
                            <td className="px-4 py-4 align-top pt-6">{getStatusBadge(order.delivery_status)}</td>
                        </tr>
                    );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
        <button className="text-sm font-medium text-gray-500 hover:text-gray-800">← Previous</button>
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded-md bg-green-100 text-green-600 font-semibold text-sm">1</button>
          <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
        </div>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-800">Next →</button>
      </div>

    </div>
  );
};

export default RecentOrdersTable;