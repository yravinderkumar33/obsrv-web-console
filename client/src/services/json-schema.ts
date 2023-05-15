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

// const reduceColumnsToParent = (payload: any) => {
//     return _.reduce(payload, (acc: any, current: any) => {
//         const { column } = current;
//         const [parent]: any = _.split(column, '.');
//         const existing = acc[parent] || [];
//         acc[parent] = [...existing, current];
//         return acc;
//     }, {});
// }

const insertProperties = (data: any) => data.flatMap((item: any, index: any) => (index === data.length - 1 ? [item] : [item, 'properties']));

const transformData = (data: any, jsonSchemaData: any) => {
    return _.reduce(data, (result: any, obj) => {
        const columns = obj.column.split('.');
        let parent: any = result;
        columns.forEach((column: any, index: any) => {
            const originalColumn = obj.column;
            let rootType = _.size(columns) > 1 ? _.cloneDeep(columns).slice(0, -1) : columns;
            const columnWithoutDots = column.replace(/\./g, '');
            let subRows: any = _.get(parent, 'subRows');
            if (!subRows) {
                subRows = [];
                parent.subRows = subRows;
            }
            let subRow = _.find(subRows, { column: columnWithoutDots });
            if (!subRow) {
                subRow = { column: columnWithoutDots, originalColumn, type: _.get(jsonSchemaData, ['properties', ...insertProperties(rootType), 'type']) };
                subRows.push(subRow);
            }
            parent = subRow;
            if (index === columns.length - 1) {
                Object.assign(subRow, _.omit(obj, ['column',]));
            }
        });
        return result;
    }, { "subRows": [] });
}

export const getNesting = (payload: any, jsonSchemaData: any) => {
    // const data = reduceColumnsToParent(payload);
    const data: any = transformData(payload, jsonSchemaData);
    // return nestedToColumns(data, jsonSchemaData);
    return data.subRows;
}

// export const nestedToColumns = (payload: any, jsonSchemaData: any) => {
//     return _.reduce(payload, (acc: any, current: any,) => {
//         const property = current;
//         const existing = acc || [];
//         if (_.values(property).length === 1) {
//             let [data] = property;
//             data = { ...data, originalColumn: data.column };
//             acc = [...existing, data];
//         }
//         else if (property.length > 1) {
//             const subRows = property;
//             const [element] = property;
//             const [parent] = _.split(element?.column, ".");
//             const subRowsData = subRows.map((item: any) => (
//                 {
//                     ...item,
//                     column: item.column.replace(`${parent}.`, ''),
//                     originalColumn: item.column,
//                 }
//             ));
//             const data = {
//                 column: parent,
//                 type: _.get(jsonSchemaData, ['properties', parent, 'type']),
//                 subRows: subRowsData,
//             }
//             acc = [...existing, data];
//         }
//         return acc;
//     }, []);
// }

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
                result[prefix] = { type, key: ref, ref, properties, items, ...rest };
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
        let existingRequiredKeys = _.get(schema, pathToRequiredProperty) || [];
        if (required) {
            // add to required property.
            const updatedRequiredKeys = _.includes(existingRequiredKeys, schemaKey) ? existingRequiredKeys : [...existingRequiredKeys, schemaKey];
            _.set(schema, pathToRequiredProperty, updatedRequiredKeys);
        } else {
            // remove from required property.
            const updatedRequiredKeys = _.difference(existingRequiredKeys, [schemaKey]);
            if (_.size(updatedRequiredKeys) > 0)
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
    const existing = _.get(schema, schemaPath);
    _.set(schema, schemaPath, { ...existing, type });
}

export const updateJSONSchema = (schema: Record<string, any>, updatePayload: Record<string, any>) => {
    const clonedOriginal = _.cloneDeep(schema);
    const modifiedRows = _.filter(_.get(updatePayload, 'schema'), ['isModified', true]);
    _.forEach(modifiedRows, modifiedRow => {
        const { isDeleted = false, required = false, key, type } = modifiedRow;
        if (isDeleted) {
            deleteItemFromSchema(clonedOriginal, `schema.${key}`, false);
        } else {
            updateTypeInSchema(clonedOriginal, `schema.${key}`, type);
            changeRequiredPropertyInSchema(clonedOriginal, `schema.${key}`, required);
        }
    });
    return clonedOriginal;
}
