import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice";

// 🔥 1. YAHAN WISHLIST REDUCER IMPORT KIYA HAI
import wishlistReducer from "../features/wishlistSlice";

// 🔥 2. SIRF EK MAIN API SLICE IMPORT KARNA HAI AB
import { apiSlice } from "../store/apiSlice";

// ==========================================
// CART STORAGE LOGIC
// ==========================================
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveCartState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// ==========================================
// 🔥 WISHLIST STORAGE LOGIC 
// ==========================================
const loadWishlistState = () => {
  try {
    const serializedState = localStorage.getItem("wishlistState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveWishlistState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("wishlistState", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// ==========================================
// STORE CONFIGURATION
// ==========================================
const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    
    // 🔥 3. SAARI ALAG-ALAG APIs KI JAGAH AB BAS YE EK LINE AAYEGI
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  preloadedState: {
    cart: loadCartState(), 
    wishlist: loadWishlistState(), 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // 🔥 4. SAARI MIDDLEWARES HATA KAR BAS MAIN MIDDLEWARE LAGA DIYA
      apiSlice.middleware 
    ), 
});

// 🔥 Jab bhi store update hoga, Cart aur Wishlist dono save honge
store.subscribe(() => {
  saveCartState(store.getState().cart);
  saveWishlistState(store.getState().wishlist);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;