import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: { kelas_id: null, bulan: null, tahun: null },
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setFilters, resetFilters } = attendanceSlice.actions;
export default attendanceSlice.reducer;
