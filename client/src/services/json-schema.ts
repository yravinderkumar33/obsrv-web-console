import * as _ from 'lodash'
import axios from 'axios';
import apiEndpoint from 'data/apiEndpoints';

export const fetchJsonSchema = (data: Record<string, any>) => {
    return axios.post(apiEndpoint.generateJsonSchema, data)
        .then(response => response.data?.result);
}

const flatten = (schemaObject: Record<string, any>) => {
    const result: Record<string, any> = {};
    const getKeyName = (prefix: string, key: string) => prefix ? `${prefix}.${key}` : key;
    const flattenHelperFn = (propertySchema: Record<string, any>, prefix: string, ref: string) => {
        const { type, properties, items, ...rest } = propertySchema;
        if (type === 'object' && properties) {
            for (let [key, value] of Object.entries(properties)) {
                flattenHelperFn(value as Record<string, any>, getKeyName(prefix, key), getKeyName(ref, `properties.${key}`));
            }
        } else if (type === 'array' && items) {
            if (['array', 'object'].includes(items?.type)) {
                flattenHelperFn(items, prefix, getKeyName(ref, `items`))
            } else {
                flattenHelperFn(items, prefix, ref)
            }
        } else {
            result[prefix] = { type, key: ref, ref, ...rest };
        }
    }

    flattenHelperFn(schemaObject, "", "");
    return result;
}

export const flattenSchema = (schema: Record<string, any>) => {
    const flattend = flatten(schema)
    return _.map(flattend, (value, key) => ({ column: key, ...value }))
}

const removeRequiredFlag = (jsonSchema: any, key: string) => {
    if (!_.has(jsonSchema, key)) return;
    const keys = _.split(key, '.');
    const length = keys.length
    if (!length) return;
    const index = _.findLastIndex(keys, 'properties')
    const parentPath = _.join(_.slice(keys, 0, index), '.');
    const propertyKey = _.last(keys);
    const requiredProperties = _.get(jsonSchema, [parentPath, 'required']);
    if (!requiredProperties) return;
    const updatedRequiredKey = _.difference(requiredProperties, [propertyKey]);
    _.set(jsonSchema, `${parentPath}.required`, updatedRequiredKey);
    console.log(jsonSchema);
}

export const updateJSONSchema = (original: any, updatePayload: any) => {
    const clonedOriginal = _.cloneDeep(original)
    _.forEach(updatePayload, (values, key) => {
        const valueFromOriginalPayload = clonedOriginal[key];
        if (valueFromOriginalPayload) {
            const modifiedRows = _.filter(values, ['isModified', true]);
            _.forEach(modifiedRows, row => {
                const { isDeleted = false, key, value } = row;
                if (isDeleted) {
                    // removeRequiredFlag(valueFromOriginalPayload, key);
                    _.unset(valueFromOriginalPayload, key);
                } else {
                    _.set(valueFromOriginalPayload, key, value);
                }
            })
        }
    })
    return clonedOriginal;
}

export const checkForCriticalSuggestion = (suggestions: any) => _.some(suggestions, suggestion => {
    return _.includes(['critical', 'high'], suggestion?.severity?.toLowerCase())
})

export const isResolved = (payload: Record<string, any>) => {
    const { suggestions = [], resolved = false } = payload;
    const isCritical = checkForCriticalSuggestion(suggestions);
    return isCritical ? resolved : true;
}

export const areConflictsResolved = (payload: Array<any>) => {
    return _.every(payload, isResolved);
}