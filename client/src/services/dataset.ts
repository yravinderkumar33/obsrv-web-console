import { datasets } from "data/dataset"

export const fetchDatasets = (config: Record<string, any>) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(datasets)
        }, 2000)
    })
}



