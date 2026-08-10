import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",

  initialState: {
    data: [],
    loaded: false
  },

  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload;
      state.loaded = true;
    },

    addCategory: (state, action) => {
      state.data.categories.push(action.payload);
    },

    removeCategory: (state, action) => {
      state.data.categories = state.data.categories.filter(
        category => category.id !== action.payload
      );
    },
    
    clearCategories: (state) => {
      state.data.categories = [];
      state.loaded = false;
    }
  }
});

export const {
  setCategories,
  addCategory,
  removeCategory,
  clearCategories
} = categorySlice.actions;

export const selectCategories = (state) => state.categories.data.categories;

export default categorySlice.reducer;