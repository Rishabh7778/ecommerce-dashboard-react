import { useMemo, useState } from 'react';
import { useGetMyOrdersQuery } from '../services/orderApi';
import { Loader2, ShoppingBag, Truck, CheckCircle, Clock, Package, XCircle, ChevronRight, ReceiptText, MapPin, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageSize = 5;

const statusConfig = (status: string) => {
  switch (status) {
    case 'delivered': return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle size={16} />, label: 'Delivered' };
    case 'out_for_delivery': return { bg: 'bg-violet-50', text: 'text-violet-600', icon: <Truck size={16} />, label: 'Out for delivery' };
    case 'shipped': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Truck size={16} />, label: 'Shipped' };
    case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-600', icon: <XCircle size={16} />, label: 'Cancelled' };
    default: return { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock size={16} />, label: 'Processing' };
  }
};

const TrackingModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  const status = order.delivery_status || 'processing';
  const isCancelled = status === 'cancelled';
  const steps = [
    { key: 'processing', label: 'Order confirmed', text: 'Your order has been received and is being prepared.', icon: Package },
    { key: 'shipped', label: 'Shipped', text: 'Your package has left our fulfilment centre.', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for delivery', text: 'Your rider is on the way with your order.', icon: MapPin },
    { key: 'delivered', label: 'Delivered', text: 'Your order has been delivered successfully.', icon: CheckCircle },
  ];
  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-label="Track order">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-[#effbf5] px-6 py-5">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#3BB77E]">Live order tracking</p><h3 className="mt-1 text-xl font-black text-[#253D4E]">{order.products}</h3><p className="mt-1 text-sm text-slate-500">Order #{order.order_id?.slice(-8)}</p></div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-white">Close</button>
        </div>
        <div className="p-6">
          {isCancelled ? <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"><strong>Order cancelled.</strong> Please contact support if you need help with this order.</div> : <div className="space-y-0">{steps.map((step, index) => {
            const complete = index <= currentStep;
            const Icon = step.icon;
            return <div key={step.key} className="relative flex gap-4 pb-7 last:pb-0">{index < steps.length - 1 && <span className={`absolute left-[17px] top-9 h-[calc(100%-20px)] w-0.5 ${complete && index < currentStep ? 'bg-[#3BB77E]' : 'bg-slate-100'}`} />}<span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${complete ? 'bg-[#3BB77E] text-white' : 'bg-slate-100 text-slate-400'}`}><Icon size={17} /></span><div className="pt-1"><p className={`font-bold ${complete ? 'text-[#253D4E]' : 'text-slate-400'}`}>{step.label}</p><p className="mt-0.5 text-sm leading-5 text-slate-500">{step.text}</p></div></div>;
          })}</div>}
          <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">Tracking status refreshes automatically when the store updates your delivery.</p>
        </div>
      </div>
    </div>
  );
};

const MyOrdersTab = () => {
  const { data, isLoading } = useGetMyOrdersQuery(undefined, { pollingInterval: 15000, refetchOnFocus: true });
  const [currentPage, setCurrentPage] = useState(1);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const orders = data?.orders || [];
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const visibleOrders = useMemo(() => orders.slice((currentPage - 1) * pageSize, currentPage * pageSize), [orders, currentPage]);

  if (isLoading) return <div className="flex min-h-[400px] flex-col items-center justify-center p-20"><Loader2 className="mb-4 animate-spin text-[#3BB77E]" size={48} /><p className="font-medium text-gray-500">Fetching your orders...</p></div>;
  if (!orders.length) return <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-gray-50 bg-white p-16 text-center shadow-sm"><div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50"><ShoppingBag className="text-gray-300" size={48} /></div><h3 className="text-2xl font-black text-[#253D4E]">No Orders Yet!</h3><p className="mt-3 max-w-sm font-medium text-gray-500">Looks like you haven't made your first purchase yet.</p><Link to="/shop" className="mt-8 rounded-xl bg-[#3BB77E] px-8 py-3 font-bold text-white shadow-lg shadow-green-100">Start Shopping</Link></div>;

  return <div className="w-full space-y-6 animate-fadeIn">
    <div className="flex items-center justify-between"><div><h2 className="text-2xl font-black text-[#253D4E] sm:text-3xl">Order History</h2><p className="mt-1 text-sm text-slate-500">Your delivery status updates automatically.</p></div><span className="rounded-lg bg-[#def9ec] px-3 py-1 text-sm font-bold text-[#3BB77E]">{orders.length} Orders</span></div>
    <div className="flex flex-col gap-4">
      {visibleOrders.map((order: any, index: number) => {
        const config = statusConfig(order.delivery_status);
        const image = order.product_image?.split(',')[0];
        return <div key={order.item_unique_id || index} className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all hover:border-green-200"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <Link to={order.product_id ? `/product/${order.product_id}` : '/shop'} className="flex min-w-0 flex-1 items-start gap-4 sm:items-center sm:gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:h-20 sm:w-20">{image ? <img src={image} alt={order.products} className="h-full w-full object-cover" /> : <Package size={30} className="text-slate-400" />}</div><div className="min-w-0"><div className="mb-1.5 flex flex-wrap items-center gap-2"><h3 className="truncate text-lg font-extrabold text-[#253D4E] sm:text-xl">{order.products || 'Mixed Package'}</h3><span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider ${order.status === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>{order.status === 'success' ? 'Paid' : 'Unpaid'}</span></div><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-500"><span className="flex items-center gap-1"><ReceiptText size={14} />#{order.order_id?.slice(-8)}</span><span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div><span className="mt-2 inline-flex text-sm font-bold text-[#3BB77E]">View product details <ChevronRight size={16} /></span></div></Link>
          <div className="flex w-full flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between xl:w-auto xl:flex-col xl:items-end xl:border-0 xl:pt-0"><div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><span className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest ${config.bg} ${config.text}`}>{config.icon}{config.label}</span><span className="text-xl font-black text-[#253D4E]">₹{Number(order.amount).toFixed(2)}</span></div><button type="button" onClick={() => setTrackingOrder(order)} className="flex items-center justify-center gap-1.5 rounded-xl bg-[#3BB77E] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 transition-colors hover:bg-[#2fa06c]">Track order <ChevronRight size={16} /></button></div>
        </div></div>;
      })}
    </div>
    {totalPages > 1 && <div className="flex items-center justify-center gap-3 pt-2"><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={18} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" key={page} onClick={() => setCurrentPage(page)} className={`h-9 w-9 rounded-lg text-sm font-bold ${page === currentPage ? 'bg-[#3BB77E] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>)}<button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={18} /></button></div>}
    {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
  </div>;
};

export default MyOrdersTab;
