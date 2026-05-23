import { useGetMyOrdersQuery } from '../services/orderApi';
import { Loader2, ShoppingBag, Truck, CheckCircle, Clock, Package, XCircle, ChevronRight, ReceiptText } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrdersTab = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center p-20 min-h-[400px]">
      <Loader2 className="animate-spin text-[#3BB77E] mb-4" size={48} />
      <p className="text-gray-500 font-medium animate-pulse">Fetching your orders...</p>
    </div>
  );

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="bg-white p-16 rounded-[2rem] text-center shadow-sm border border-gray-50 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-gray-300" size={48} />
        </div>
        <h3 className="text-2xl font-black text-[#253D4E] tracking-tight">No Orders Yet!</h3>
        <p className="text-gray-500 mt-3 font-medium max-w-sm">Looks like you haven't made your first purchase yet. Explore our deals and start shopping!</p>
        <Link to="/shop" className="mt-8 bg-[#3BB77E] hover:bg-[#2fa06c] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-black text-[#253D4E] tracking-tight">Order History</h2>
        <span className="bg-[#def9ec] text-[#3BB77E] font-bold px-3 py-1 rounded-lg text-sm">
          {orders.length} Orders
        </span>
      </div>
      
      <div className="flex flex-col gap-5">
        {orders.map((order: any, index: number) => {
          const isPaid = order.status === 'success';

          // Dynamic colors for delivery status
          const getStatusConfig = (status: string) => {
            switch (status) {
              case 'delivered': return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle size={16} /> };
              case 'processing': return { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock size={16} /> };
              case 'shipped': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Truck size={16} /> };
              case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-600', icon: <XCircle size={16} /> };
              default: return { bg: 'bg-gray-50', text: 'text-gray-600', icon: <Package size={16} /> };
            }
          };

          const statusConfig = getStatusConfig(order.delivery_status);

          return (
            <div 
              key={order.item_unique_id || index} 
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-green-200 transition-all duration-300 group"
            >
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                
                {/* 1. Left Section: Icon & Main Details */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                  
                  {/* Order Icon */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.2rem] flex items-center justify-center shrink-0 transition-colors ${order.delivery_status === 'delivered' ? 'bg-[#def9ec] text-[#3BB77E]' : 'bg-gray-50 text-gray-400'}`}>
                    <Package size={32} strokeWidth={1.5} />
                  </div>

                  {/* Order Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    
                    {/* Header Row (Name & Payment) */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                      <h3 className="font-extrabold text-lg sm:text-xl text-[#253D4E] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                        {order.products || 'Mixed Package'}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider ${
                        isPaid ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <ReceiptText size={14} className="text-gray-400" />
                        ID: <span className="font-mono text-gray-800">#{order.order_id?.slice(-8)}</span>
                      </span>
                      <span className="hidden sm:block text-gray-300">•</span>
                      <span>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                  </div>
                </div>

                {/* 2. Right Section: Status, Price & Actions */}
                <div className="flex flex-col sm:flex-row xl:flex-col justify-between sm:items-center xl:items-end gap-4 pt-5 xl:pt-0 border-t xl:border-t-0 border-gray-100 w-full xl:w-auto shrink-0">
                  
                  {/* Status & Price Row */}
                  <div className="flex flex-row xl:flex-col justify-between items-center xl:items-end w-full gap-2">
                    
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/50 shadow-sm ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.icon}
                      <span className="text-[11px] font-bold uppercase tracking-widest">
                        {order.delivery_status}
                      </span>
                    </div>

                    <div className="text-xl sm:text-2xl font-black text-[#253D4E]">
                      ₹{Number(order.amount).toFixed(2)}
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 xl:mt-3">
                    <button className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-colors text-sm text-center">
                      Details
                    </button>
                    <button className="flex-1 sm:flex-none px-5 py-2.5 bg-[#3BB77E] hover:bg-[#2fa06c] text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-100 text-sm flex items-center justify-center gap-2 group-hover:pr-4">
                      Track <ChevronRight size={16} className="hidden group-hover:block transition-all" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrdersTab;