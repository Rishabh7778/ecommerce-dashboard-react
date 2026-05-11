import { useGetAllOrdersAdminQuery } from '../services/orderApi';
import { Loader2, CreditCard, User, CalendarDays, Receipt } from 'lucide-react';

const Transactions = () => {
    // Same API use kar rahe hain kyunki saara data isme hai
    const { data, isLoading, error } = useGetAllOrdersAdminQuery();
    
    const transactions = data?.orders || [];

    if (isLoading) {
        return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 font-bold mt-10">Failed to load transactions.</div>;
    }

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <div className="flex items-center gap-3">
                        <CreditCard className="text-[#3BB77E]" size={32} />
                        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                    </div>
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">
                        Total Transactions: {transactions.length}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-4 font-semibold rounded-tl-xl">Payment ID</th>
                                <th className="p-4 font-semibold">Order Ref</th>
                                <th className="p-4 font-semibold">Customer Info</th>
                                <th className="p-4 font-semibold">Date & Time</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold rounded-tr-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-6 text-gray-500 font-medium">No transactions found.</td>
                                </tr>
                            ) : (
                                transactions.map((trx: any) => (
                                    <tr key={trx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                                        
                                        {/* Payment ID (Highlight kiya hai kyunki ye transaction page hai) */}
                                        <td className="p-4">
                                            <div className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded w-fit flex items-center gap-2">
                                                <Receipt size={14} className="text-gray-500" />
                                                {trx.payment_id || 'N/A'}
                                            </div>
                                        </td>

                                        {/* Order ID */}
                                        <td className="p-4 font-mono text-xs text-gray-500">
                                            {trx.order_id}
                                        </td>
                                        
                                        {/* Customer Info */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                                <User size={16} className="text-[#3BB77E]"/>
                                                {trx.userName || 'Guest User'}
                                            </div>
                                            <div className="text-xs text-gray-500 ml-6">{trx.userEmail}</div>
                                        </td>

                                        {/* Date */}
                                        <td className="p-4 text-gray-500 text-xs">
                                            <div className="flex items-center gap-1">
                                                <CalendarDays size={14} />
                                                {new Date(trx.created_at).toLocaleString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="p-4 font-extrabold text-lg text-gray-800">
                                            ${Number(trx.amount).toFixed(2)}
                                        </td>
                                        
                                        {/* Payment Status */}
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize flex items-center w-fit gap-1 ${
                                                trx.status === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                trx.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                                                'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${trx.status === 'success' ? 'bg-green-500' : trx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                {trx.status}
                                            </span>
                                        </td>
                                        
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default Transactions;