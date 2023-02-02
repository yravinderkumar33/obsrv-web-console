import { jsonSchema } from "data/json-schema"
import * as _ from 'lodash'

export const fetchJsonSchema = (config: Record<string, any>) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(jsonSchema)
        }, 2000)
    })
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

export const updateJSONSchema = (original: any, updatePayload: any) => {
    const clonedOriginal = _.cloneDeep(original)
    _.forEach(updatePayload, (values, key) => {
        const valueFromOriginalPayload = clonedOriginal[key];
        if (valueFromOriginalPayload) {
            const modifiedRows = _.filter(values, ['isModified', true]);
            console.log(modifiedRows);
            _.forEach(modifiedRows, row => {
                const { isDeleted = false, key, value } = row;
                if (isDeleted) {
                    _.unset(valueFromOriginalPayload, key);
                } else {
                    _.set(valueFromOriginalPayload, key, value);
                }
            })
        }
    })
    return clonedOriginal;
}