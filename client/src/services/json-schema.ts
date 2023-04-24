import * as _ from 'lodash'
import { http } from 'services/http';
import apiEndpoint from 'data/apiEndpoints';

export const fetchJsonSchema = (data: Record<string, any>) => {
    return http.post(apiEndpoint.generateJsonSchema, data)
        .then(response => response.data?.result);
}

const addRequiredFields = (
    type: string,
    result: Record<string, any>,
    schemaObject: Record<string, any>,
    required: string[],
) => {
    const requiredFields = schemaObject.required || [];
    _.map(result, (item) => {
        if (type === 'array' || type === 'object') {
            if (required && required.includes(item.key.replace('properties.', ''))) item.required = true;
            else if (requiredFields.includes(item.key.replace('properties.', ''))) item.required = true;
            else item.required = false;
        }
        else if (requiredFields.includes(item.key.replace('properties.', ''))) item.required = true;
        else item.required = false;
    })
}

const flatten = (schemaObject: Record<string, any>) => {
    let schemaObjectData = schemaObject;
    const result: Record<string, any> = {};
    const getKeyName = (prefix: string, key: string) => prefix ? `${prefix}.${key}` : key;
    const flattenHelperFn = (propertySchema: Record<string, any>, prefix: string, ref: string) => {
        const { type, properties, items, required, ...rest } = propertySchema;
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
            result[prefix] = { type, key: ref, ref, properties, items, ...rest };
        }
        addRequiredFields(type, result, schemaObjectData, required);
    }

    flattenHelperFn(schemaObjectData, "", "");
    return result;
}

export const flattenSchema = (schema: Record<string, any>) => {
    const flattend = flatten(schema);
    return _.map(flattend, (value, key) => ({ column: key, ...value }))
}

const modifyRequired = (schemaPropertiesObject: any, requiredPath: any, required: any, requiredKey: any) => {
    const previousValue = _.get(schemaPropertiesObject, requiredPath) || [];
    const previousRequired = _.get(previousValue, 'required') || [];
    if (required)
        _.set(schemaPropertiesObject, requiredPath, { ...previousValue, required: [...previousRequired, requiredKey] });
    if (!required)
        _.set(schemaPropertiesObject, requiredPath, { ...previousValue, required: _.pull(previousRequired, requiredKey) });
}

export const checkIfRequired = (schemaPropertiesObject: any, originalRequired: string[],
    key: string, required: boolean
) => {
    const jsonKey = key.replace('properties.', '');
    if (jsonKey.includes(".")) {
        const path = jsonKey.split(".");
        const actualKey = _.last(path);
        const keyType = _.get(schemaPropertiesObject, [path[0], 'type']);
        if (keyType === "array") {
            const requiredPath = [path[0], 'items'].join(".");
            modifyRequired(schemaPropertiesObject, requiredPath, required, actualKey);
        }
        else if (keyType === "object") {
            const requiredPath = path[0];
            modifyRequired(schemaPropertiesObject, requiredPath, required, actualKey);
        }
        return [...originalRequired];
    }
    else if (!required) return _.pull(originalRequired, jsonKey);
    else if (_.includes(originalRequired, key)) return originalRequired;
    else return [...originalRequired, jsonKey];
}

export const deleteItemFromSchema = (valueFromOriginalPayload: any, key: string) => {
    _.unset(valueFromOriginalPayload, key);
}

export const updateJSONSchema = (original: any, updatePayload: any) => {
    const clonedOriginal = _.cloneDeep(original);
    _.forEach(updatePayload, (values, key) => {
        let valueFromOriginalPayload = clonedOriginal[key];
        if (valueFromOriginalPayload) {
            const modifiedRows = _.filter(values, ['isModified', true]);
            _.forEach(modifiedRows, row => {
                const { isDeleted = false, required = true, key, type } = row;
                if (isDeleted)
                    deleteItemFromSchema(valueFromOriginalPayload, key);
                else {
                    _.set(valueFromOriginalPayload, key, { type: type });
                    if (required && !clonedOriginal.schema.required) {
                        clonedOriginal.schema.required = [];
                        _.set(clonedOriginal, 'schema.required', checkIfRequired(clonedOriginal.schema.properties, clonedOriginal.schema.required, key, required));
                    } else if (required && clonedOriginal.schema.required) {
                        _.set(clonedOriginal, 'schema.required', checkIfRequired(clonedOriginal.schema.properties, clonedOriginal.schema.required, key, required));
                    }
                }
            })
        }
    });
    return clonedOriginal;
}

export const checkForCriticalSuggestion = (suggestions: any) => _.some(suggestions, suggestion => {
    return _.includes(['must-fix'], suggestion?.severity?.toLowerCase())
})

export const isResolved = (payload: Record<string, any>) => {
    const { suggestions = [], resolved = false } = payload;
    const isCritical = checkForCriticalSuggestion(suggestions);
    return isCritical ? resolved : true;
}

export const areConflictsResolved = (payload: Array<any>) => {
    return _.every(payload, isResolved);
}
