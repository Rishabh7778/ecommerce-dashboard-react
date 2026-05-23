// src/features/wishlistSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type WishlistItemType = {
  id: number;
  title: string;
  price: number;
  img: string;
};

type WishlistState = {
  wishlistItems: WishlistItemType[];
};

const initialState: WishlistState = {
  wishlistItems: [] // LocalStorage se bhi link kar sakte hain baad mein
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Agar item pehle se hai toh remove karega, nahi toh add karega (Toggle)
    toggleWishlist: (state, action: PayloadAction<WishlistItemType>) => {
      const existingItem = state.wishlistItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        state.wishlistItems = state.wishlistItems.filter(item => item.id !== action.payload.id);
      } else {
        state.wishlistItems.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    }
  }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;