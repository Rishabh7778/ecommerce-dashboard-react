import { useGetMyOrdersQuery } from '../services/orderApi';
import { Loader2, ShoppingBag, Truck, CheckCircle, Clock, Package, XCircle } from 'lucide-react';

const MyOrdersTab = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#3BB77E]" size={40} /></div>;

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-800">No Orders Yet!</h3>
        <p className="text-gray-500 mt-2">Bhai, kuch shopping toh karo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800">Your Order History</h2>
      
      <div className="grid grid-cols-1 gap-5">
        {orders.map((order: any, index: number) => {
          const isPaid = order.status === 'success';

          return (
            <div key={order.item_unique_id || index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Product Info Section */}
              <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-[#3BB77E] shrink-0">
                  <Package size={28} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {/* Item Name */}
                    <span className="font-extrabold text-lg text-gray-800 line-clamp-1">
                        {order.products || 'Item Package'}
                    </span>
                    {/* Payment Status Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${
                      isPaid ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500">
                    Order Ref: <span className="font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">#{order.order_id?.slice(-8)}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Status and Price Section */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                
                {/* Delivery Status */}
                <div className="flex items-center gap-1.5 mb-2 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                  {order.delivery_status === 'processing' && <Clock size={14} className="text-orange-500" />}
                  {order.delivery_status === 'shipped' && <Truck size={14} className="text-blue-500" />}
                  {order.delivery_status === 'delivered' && <CheckCircle size={14} className="text-green-500" />}
                  {order.delivery_status === 'cancelled' && <XCircle size={14} className="text-red-500" />}
                  
                  <span className={`text-[11px] font-bold uppercase tracking-wide ${
                    order.delivery_status === 'delivered' ? 'text-green-600' : 
                    order.delivery_status === 'processing' ? 'text-orange-500' : 
                    order.delivery_status === 'cancelled' ? 'text-red-500' : 'text-blue-600'
                  }`}>
                    {order.delivery_status}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <div className="text-xl font-black text-[#253D4E]">
                      ₹{Number(order.amount).toFixed(2)}
                  </div>
                  
                  {/* Track Button (Mobile par dikhega, Desktop par chhupa diya ya dikha sakte ho) */}
                  <button className="md:hidden px-4 py-1.5 bg-[#3BB77E] text-white font-bold rounded-lg text-xs">
                    Track
                  </button>
                </div>
              </div>

              {/* Track Button (Desktop view) */}
              <button className="hidden md:block px-5 py-2.5 border-2 border-gray-100 text-gray-600 hover:border-[#3BB77E] hover:text-[#3BB77E] font-bold rounded-xl transition-all text-sm">
                Track Item
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrdersTab;