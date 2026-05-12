import React, { useState } from 'react';
import { ChevronLeft, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartQuantity, clearCart } from '../features/cartSlice'; // 🔥 clearCart Import kiya
import { useCreateOrderMutation, useVerifyPaymentMutation } from '../services/productApi';
import { useGetMyAddressesQuery } from '../services/addressApi';
import type { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom'; // 🔥 Navigate import kiya
import Swal from 'sweetalert2';

const ShoppingCart: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🔥 Redirect ke liye

  // RTK Query Mutations
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { data: addressData, isLoading: isLoadingAddress } = useGetMyAddressesQuery();
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);

  const deliveryFee = 60;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = items.length > 0 ? subtotal + deliveryFee : 0;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      Swal.fire("Hold On!", "Please select a delivery address first.", "warning");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK load nahi ho paya!");
      return;
    }

    try {
      const order = await createOrder({ 
  amount: total, 
  address_id: Number(selectedAddressId) 
}).unwrap();

      const options = {
        key: "rzp_test_SaHsGrX7ll56Xr",
        amount: order.amount,
        currency: order.currency,
        name: "Bitezone", // 🔥 Isey update kar diya
        description: "Transaction",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: items
            };

            await verifyPayment(verifyData).unwrap();

            // 🔥 YAHAN HUA ASLI MAGIC: Cart Khali aur Success Message
            dispatch(clearCart());

            Swal.fire({
              title: "Awesome!",
              text: "Payment Successful & Order Placed!",
              icon: "success",
              confirmButtonColor: "#00b212"
            }).then(() => {
              // OK par click karte hi User ko Orders page ya Home page par bhej do
              navigate('/account');
            });

          } catch (vErr) {
            Swal.fire("Oops!", "Verification Failed!", "error");
          }
        },
        prefill: {
          name: "Guest",
          email: "guest@example.com",
        },
        theme: { color: "#00b212" },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        alert("Payment Fail ho gayi: " + response.error.description);
      });

      rzp.open();

    } catch (err: any) {
      console.error("Order Creation Failed:", err);
      Swal.fire("Server error", err.data?.message || "Order create nahi hua.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-900 font-semibold hover:text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Shopping Continue
          </button>
          <hr className="my-6 border-gray-200" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-xl font-semibold mb-1">Shopping cart</h1>
              <p className="text-sm text-gray-500">
                You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 py-8">Your cart is currently empty.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <span className="font-semibold text-gray-700 min-w-[100px]">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-8 lg:gap-12">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-medium w-4 text-center">{item.quantity}</span>
                        <div className="flex flex-col text-gray-500">
                          <button onClick={() => dispatch(updateCartQuantity({ id: item.id, delta: 1 }))}><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => dispatch(updateCartQuantity({ id: item.id, delta: -1 }))}><ChevronDown className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="w-16 text-right font-medium text-gray-700 text-sm">Tk.{(item.price * item.quantity).toFixed(2)}</div>
                      <button onClick={() => dispatch(removeFromCart(item.id))} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-[350px]">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-gray-700"><span>Order</span><span>Tk.{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-700"><span>Delivery</span><span>Tk.{items.length > 0 ? deliveryFee : 0}</span></div>
                <hr className="border-gray-100 my-4" />
                <div className="flex justify-between text-base font-bold text-gray-900"><span>Total</span><span className="text-gray-400 font-semibold">Tk.{total.toFixed(2)}</span></div>
              </div>

              {/* --- ADDRESS SELECTION --- */}
              <div className="mt-6 mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                {isLoadingAddress ? (
                  <p className="text-xs text-gray-500">Loading addresses...</p>
                ) : addressData?.addresses?.length ? (
                  <select
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-[#00b212]"
                    value={selectedAddressId ?? ''}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    <option value="" disabled>Select an address...</option>
                    {addressData.addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.fullName} - {addr.city} ({addr.pincode})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-red-500 font-medium">No address found. Please add one from your account.</p>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || isCreatingOrder}
                className={`w-full mt-8 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2 ${items.length === 0 || isCreatingOrder
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#00b212] hover:bg-[#009910] text-white'
                  }`}
              >
                {isCreatingOrder && <Loader2 className="animate-spin" size={18} />}
                {isCreatingOrder ? "Processing..." : "Check Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;