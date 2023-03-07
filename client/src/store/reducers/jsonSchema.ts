import { createSlice } from '@reduxjs/toolkit';
import { fetchJsonSchemaThunk } from '../middlewares';

const initialState: Record<string, any> = {
    status: 'idle',
    data: null,
    error: null,
    transformed: null
};

const jsonSchema = createSlice({
    name: 'jsonSchema',
    initialState,
    reducers: {
        reset(state, action) {
            state.transformed = null;
        },
        transform(state, action) {
            state.transformed = action
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchJsonSchemaThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJsonSchemaThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.data = action.payload;
            })
            .addCase(fetchJsonSchemaThunk.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            });
    }
});

export default jsonSchema.reducer;
export const { reset, transform } = jsonSchema.actions;