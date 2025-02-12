import { createSlice } from '@reduxjs/toolkit';
import * as _ from 'lodash';

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
        updateState(state, action) {
            const { payload } = action;
            const { id, ...rest } = payload;
            if (!id) return state;
            if (id in _.get(state, 'pages')) {
                for (const [key, value] of Object.entries(rest as object)) {
                    const preState = _.get(state, ['pages', id, key]);
                    state.pages[id][key] = { ...preState, ...value }
                }
            } else {
                state.pages[id] = rest;
            }
        },
        deleteState(state, action) {
            const { payload } = action;
            const { id } = payload;
            delete state.pages[id]
        },
        reset: (state, action) => {
            const { payload } = action;
            const { omit = [] } = payload;
            if (!omit?.length) {
                return initialState
            } else {
                const pages = Object.keys(state.pages);
                _.forEach(_.difference(pages, omit), pageId => {
                    delete state.pages[pageId]
                })
            }
        }
    }
});

export default wizard.reducer;
export const { setMetadata, deleteState, addState, reset, updateState } = wizard.actions;
