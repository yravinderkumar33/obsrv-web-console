import { createSlice } from '@reduxjs/toolkit';
import { fetchDataThunk } from '../middlewares';

const initialState: Record<string, any> = {
    data: null,
    error: null,
    status: 'idle'
};

const dataset = createSlice({
    name: 'dataset',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDataThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.data = action.payload;
            })
            .addCase(fetchDataThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default dataset.reducer;