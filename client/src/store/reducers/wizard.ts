import { createSlice } from '@reduxjs/toolkit';

const initialState: Record<string, any> = {
    metadata: {},
    pages: {}
};

const wizard = createSlice({
    name: 'wizard',
    initialState,
    reducers: {
        setMetadata(state, action) {
            const { payload } = action;
            state.metadata = payload;
        },
        addState(state, action) {
            const { payload } = action;
            const { id, ...rest } = payload;
            state.pages[id] = rest;
        },
        deleteState(state, action) {
            const { payload } = action;
            const { id } = payload;
            delete state.pages[id]
        },
        reset: (state) => {
            state = initialState
        }
    }
});

export default wizard.reducer;
export const { setMetadata, deleteState, addState, reset } = wizard.actions;
