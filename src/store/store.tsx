import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice";

// 🔥 1. YAHAN WISHLIST REDUCER IMPORT KIYA HAI
import wishlistReducer from "../features/wishlistSlice";

import { productApi } from "../services/productApi";
import { authApi } from "../services/authApi";
import { addressApi } from "../services/addressApi";
import { orderApi } from "../services/orderApi";
import { complaintApi } from "../services/complaintApi";
import { discountApi } from "../services/discountApi";
import { categoryApi } from "../services/categoryApi";
import { userApi } from "../services/userApi";
import { offerApi } from "../services/offerApi";
import {contactApi} from "../services/contactApi";

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
// 🔥 WISHLIST STORAGE LOGIC (Naya Add Kiya)
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
    wishlist: wishlistReducer, // 🔥 Error yahin tha, ab fix ho gaya import ke sath
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer, 
    [discountApi.reducerPath]: discountApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer, 
    [contactApi.reducerPath]: contactApi.reducer,
  },
  preloadedState: {
    cart: loadCartState(), 
    wishlist: loadWishlistState(), // 🔥 App start hone par Wishlist bhi localStorage se aayegi
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware, 
      authApi.middleware, 
      addressApi.middleware, 
      orderApi.middleware, 
      complaintApi.middleware, 
      discountApi.middleware, 
      categoryApi.middleware, 
      userApi.middleware, 
      offerApi.middleware,
      contactApi.middleware
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