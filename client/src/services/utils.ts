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


export const readJsonFileContents = (file: File) => {
    return new Promise((resolve, reject) => {
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.addEventListener('load', function () {
                const fileContents = reader.result;
                if (typeof fileContents === 'string') {
                    resolve(JSON.parse(fileContents));
                } else {
                    reject('Invalid file contents');
                }
            });
            reader.readAsText(file);
        } else {
            reject('Only json files are supported');
        }
    })
}

export const downloadJSONFile = (data: any, filename: string) => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}