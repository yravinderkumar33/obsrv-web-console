import * as _ from "lodash";

const updateDataType = (
    val: string, row: any, pageData: any, persistState: any,
    setFlattenedData: any, hasConflicts: boolean, setAnchorEl: any) => {
    const updatedValues = { ...row };
    const storeState = _.cloneDeep(pageData);
    const data = _.map(storeState, state => {
        if (_.get(state, 'column') === _.get(updatedValues, 'originalColumn'))
            return { ...state, ...updatedValues, column: updatedValues.originalColumn, isModified: true, type: val, ...(hasConflicts && { resolved: true }) };
        else return state
    });
    persistState(data);
    setFlattenedData((preState: Array<Record<string, any>>) => {
        const filteredData = _.map(preState, state => {
            if (_.get(state, 'column') === _.get(updatedValues, 'originalColumn'))
                return { ...state, ...updatedValues, column: updatedValues.originalColumn, isModified: true, type: val, ...(hasConflicts && { resolved: true }) };
            else return state;
        });
        return filteredData;
    });
    setAnchorEl(null);
}

const resetDataTypeResolve = (
    row: any, pageData: any, persistState: any,
    setFlattenedData: any, hasConflicts: boolean, setAnchorEl: any) => {
    const updatedValues = { ...row };
    const storeState = _.cloneDeep(pageData);
    const data = _.map(storeState, state => {
        if (_.get(state, 'column') === _.get(updatedValues, 'originalColumn'))
            return { ...state, ...updatedValues, column: updatedValues.originalColumn, isModified: true, ...(hasConflicts && { resolved: false }) };
        else return state
    });
    persistState(data);
    setFlattenedData((preState: Array<Record<string, any>>) => {
        const filteredData = _.map(preState, state => {
            if (_.get(state, 'column') === _.get(updatedValues, 'originalColumn'))
                return { ...state, ...updatedValues, column: updatedValues.originalColumn, isModified: true, ...(hasConflicts && { resolved: false }) };
            else return state;
        });
        return filteredData;
    });
    setAnchorEl(null);
}

export { updateDataType, resetDataTypeResolve };
