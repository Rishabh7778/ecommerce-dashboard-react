import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice";
import { productApi } from "../services/productApi";
import { authApi } from "../services/authApi";
import { addressApi } from "../services/addressApi";
import { orderApi } from "../services/orderApi";
import { complaintApi } from "../services/complaintApi";
import { discountApi } from "../services/discountApi";
import { categoryApi } from "../services/categoryApi";
import { userApi } from "../services/userApi";
import { offerApi } from "../services/offerApi";


// 1. Local storage se data load karne ka function
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// 2. Data save karne ka function
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer, 
    [discountApi.reducerPath]: discountApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer, 

  },
  preloadedState: {
    cart: loadState() // App start hone par yahan se data aayega
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware, authApi.middleware, addressApi.middleware, orderApi.middleware, complaintApi.middleware, discountApi.middleware, categoryApi.middleware, userApi.middleware, offerApi.middleware), 
});

// 3. Jab bhi store change hoga, hum usko localStorage me save kar denge
store.subscribe(() => {
  saveState(store.getState().cart);
});

// Types  export karna zaroori hai TypeScript use karte waqt
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;