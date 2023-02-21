import { createSlice } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import ingestionConfigurations from 'data/ingestionConfigurations';

const initialState = _.reduce(ingestionConfigurations, (result: Record<string, any>, config) => {
    const { key } = config;
    result[key] = config
    return result;
}, {});

const ingestionConfigMasterData = createSlice({
    name: 'ingestionConfigMasterData',
    initialState,
    reducers: {}
});

export default ingestionConfigMasterData.reducer;