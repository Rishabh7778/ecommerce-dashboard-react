import { useGetAllOrdersAdminQuery, useUpdateOrderStatusMutation } from '../services/orderApi';
import { Loader2, Package } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminOrders = () => {
  const { data, isLoading } = useGetAllOrdersAdminQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateStatus({ orderId, delivery_status: newStatus }).unwrap();
      Swal.fire({
        title: 'Updated!',
        text: `Status ab ${newStatus} ho gaya hai.`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err: any) {
      console.error("Backend Error:", err);
      Swal.fire({
        title: 'Error!',
        text: err.data?.error || err.data?.message || 'Status update nahi ho paya',
        icon: 'error'
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-blue-600" size={32} />
          <h1 className="text-2xl font-bold">Manage All Orders</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Delivery Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.orders.map((order: any, index: number) => (
                  <tr key={order.item_unique_id || index} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="p-4 font-mono text-sm text-blue-600 font-bold">
                        #{order.order_id.slice(-8)}
                    </td>
                    
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{order.userName}</div>
                      <div className="text-xs text-gray-400">{order.userEmail}</div>
                    </td>
                    
                    {/* 🔥 SINGLE PRODUCT DIKHEGA AB (Bina kisi split ke) */}
                    <td className="p-4 text-sm text-gray-700 font-medium">
                        {order.products || '-'}
                    </td>
                    
                    <td className="p-4 font-semibold text-gray-800">
                        <div>₹{Number(order.amount).toFixed(2)}</div>
                        {Number(order.discount_amount) > 0 && (
                          <div className="mt-1 text-xs font-bold text-green-600">{order.discount_label || 'Discount'} applied: -₹{Number(order.discount_amount).toFixed(2)}</div>
                        )}
                        {Number(order.original_price) > Number(order.amount) && <div className="text-xs text-gray-400 line-through">Original ₹{Number(order.original_price).toFixed(2)}</div>}
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <select
                        value={order.delivery_status}
                onChange={(e) => handleStatusChange(order.item_unique_id, e.target.value)}
                        disabled={isUpdating}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none font-medium cursor-pointer"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
