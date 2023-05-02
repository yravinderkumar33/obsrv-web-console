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

const getPathToRequiredKey = (schema: Record<string, any>, schemaKeyPath: string, schemaKey: string) => {
    const regExStr = `properties.${schemaKey}`;
    const regex = `(.${regExStr})`;
    const [pathToRequiredKey] = _.split(schemaKeyPath, new RegExp(regex, 'g'));
    if (pathToRequiredKey === schemaKeyPath) return 'required'
    return `${pathToRequiredKey}.required`
}

const changeRequiredPropertyInSchema = (schema: Record<string, any>, schemaKeyPath: string, required: boolean) => {
    const schemaKey = _.last(_.split(schemaKeyPath, '.'));
    if (schemaKey) {
        const pathToRequiredProperty = getPathToRequiredKey(schema, schemaKeyPath, schemaKey);
        let existingRequiredKeys = _.get(schema, [pathToRequiredProperty]) || [];
        if (required) {
            // add to required property.
            const updatedRequiredKeys = _.includes(existingRequiredKeys, schemaKey) ? existingRequiredKeys : [...existingRequiredKeys, schemaKey];
            _.set(schema, pathToRequiredProperty, updatedRequiredKeys);
        } else {
            // remove from required property.
            const updatedRequiredKeys = _.difference(existingRequiredKeys, [schemaKey]);
            _.set(schema, pathToRequiredProperty, updatedRequiredKeys);
        }
    }
}

const deleteItemFromSchema = (schema: Record<string, any>, schemaKeyPath: string, required: boolean) => {
    if (_.has(schema, schemaKeyPath)) {
        _.unset(schema, schemaKeyPath);
        changeRequiredPropertyInSchema(schema, schemaKeyPath, required);
    }
}

const updateTypeInSchema = (schema: Record<string, any>, schemaPath: string, type: string) => {
    if (_.has(schema, schemaPath)) {
        const existing = _.get(schema, schemaPath);
        _.set(schema, schemaPath, { ...existing, type });
    }
}

export const updateJSONSchema = (schema: Record<string, any>, updatePayload: Record<string, any>) => {
    const clonedOriginal = _.cloneDeep(schema);
    const modifiedRows = _.filter(_.get(updatePayload, 'schema'), ['isModified', true]);
    _.forEach(modifiedRows, modifiedRow => {
        const { isDeleted = false, required = true, key, type } = modifiedRow;
        if (isDeleted) {
            deleteItemFromSchema(_.get(clonedOriginal, 'schema'), key, false);
        } else {
            updateTypeInSchema(_.get(clonedOriginal, 'schema'), key, type);
            changeRequiredPropertyInSchema(_.get(clonedOriginal, 'schema'), key, required);
        }
    });
    return clonedOriginal;
}