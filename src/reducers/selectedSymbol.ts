import { createSlice } from '@reduxjs/toolkit';

const selectedSymbolSlice = createSlice({
    name: 'selectedSymbol',
    initialState: 3060,
    reducers: {
        updateSelectedSymbolSuccess: (state, { payload }) => {
            return payload
        },
    },
});

export const {
    updateSelectedSymbolSuccess,
} = selectedSymbolSlice.actions;

export default selectedSymbolSlice.reducer;

