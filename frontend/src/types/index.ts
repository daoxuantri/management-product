import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductPriceModel } from '../models/ProductPriceModel';
import { mockProducts } from '../utils/mockData';

interface SidebarState {
  collapsed: boolean;
  toggle: boolean;
}

interface HomeState {
  products: ProductPriceModel[];
  searchQuery: string;
  sortOption: string;
  fieldSelection: { [key: string]: boolean };
  exportDialogOpen: boolean;
  filterDialogOpen: boolean;
  deleteDialogOpen: boolean;
  selectedProduct: ProductPriceModel | null;
  loading: boolean;
  error: string | null;
}

interface RootState {
  sidebar: SidebarState;
  home: HomeState;
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: { collapsed: false, toggle: false } as SidebarState,
  reducers: {
    toggleSidebar(state) {
      state.toggle = !state.toggle;
    },
  },
});

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    products: mockProducts,
    searchQuery: '',
    sortOption: 'Không sắp xếp',
    fieldSelection: {
      'Tên sản phẩm': true,
      'Mã sản phẩm': true,
      'Ngày hỏi giá': true,
    },
    exportDialogOpen: false,
    filterDialogOpen: false,
    deleteDialogOpen: false,
    selectedProduct: null,
    loading: false,
    error: null,
  } as HomeState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortOption(state, action: PayloadAction<string>) {
      state.sortOption = action.payload;
    },
    updateFieldSelection(state, action: PayloadAction<{ field: string; value: boolean }>) {
      state.fieldSelection[action.payload.field] = action.payload.value;
    },
    openExportDialog(state) {
      state.exportDialogOpen = true;
    },
    closeExportDialog(state) {
      state.exportDialogOpen = false;
    },
    openFilterDialog(state) {
      state.filterDialogOpen = true;
    },
    closeFilterDialog(state) {
      state.filterDialogOpen = false;
    },
    openDeleteDialog(state, action: PayloadAction<ProductPriceModel>) {
      state.selectedProduct = action.payload;
      state.deleteDialogOpen = true;
    },
    closeDeleteDialog(state) {
      state.deleteDialogOpen = false;
      state.selectedProduct = null;
    },
    selectProduct(state, action: PayloadAction<ProductPriceModel>) {
      state.selectedProduct = action.payload;
      console.log('Navigate to product detail:', action.payload.id);
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  setSearchQuery,
  setSortOption,
  updateFieldSelection,
  openExportDialog,
  closeExportDialog,
  openFilterDialog,
  closeFilterDialog,
  openDeleteDialog,
  closeDeleteDialog,
  selectProduct,
  deleteProduct,
} = homeSlice.actions;
export const { toggleSidebar } = sidebarSlice.actions;
export const rootReducer = {
  sidebar: sidebarSlice.reducer,
  home: homeSlice.reducer,
};
export type { RootState, HomeState, SidebarState };