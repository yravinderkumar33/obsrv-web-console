export const flattenObject = (obj: Record<string, any>, parentKey = '') => {
    let flattenedData: Array<Record<string, any>> = [];

    for (let [key, value] of Object.entries(obj)) {
        let currentKey = parentKey ? `${parentKey}.${key}` : key;
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                let item = value[i];
                if (typeof item === 'object' && item !== null) {
                    flattenedData = flattenedData.concat(flattenObject(item, `${currentKey}[${i}]`));
                } else {
                    flattenedData.push({ key: `${currentKey}[${i}]`, value: item });
                }
            }
        } else if (typeof value === 'object' && value !== null) {
            flattenedData = flattenedData.concat(flattenObject(value, currentKey));
        } else {
            flattenedData.push({ key: currentKey, value });
        }
    }

    return flattenedData;
}