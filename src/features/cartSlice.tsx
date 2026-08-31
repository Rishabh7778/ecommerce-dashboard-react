import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ShopPage wale data ke hisaab se type update kiya hai
export type CartItemType = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  img: string;
  quantity: number;
};

type CartState = {
  cartItems: CartItemType[];
};

// Initial state ko empty rakha hai, store.ts isko localStorage se bhar dega
const initialState: CartState = {
  cartItems: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Agar item pehle se hai to quantity badhao, warna naya add karo
    addToCart: (state, action: PayloadAction<Omit<CartItemType, 'quantity'>>) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      // console.log("Product added/updated in cart:", action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(
        item => item.id !== action.payload
      );
    },
    // + / - buttons ke liye naya reducer
    updateCartQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
      const item = state.cartItems.find(item => item.id === action.payload.id);
      if (item) {
        const newQuantity = Math.max(1, item.quantity + action.payload.delta);
        item.quantity = newQuantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = []; 
      // Agar aap cart ko localStorage mein save kar rahe ho, toh yahan clear kar do:
      localStorage.removeItem('cart'); 
    },
  }
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
