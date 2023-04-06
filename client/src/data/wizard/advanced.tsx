import ConditionalCheckboxForm from "pages/dataset/wizard/components/ConditionalCheckboxBasedForm";
import ConditionalForm from "pages/dataset/wizard/components/ConditionalForm";

export const sections = [
    {
        id: 'dataRention',
        title: 'Data Retention And Archival',
        description: 'Configure Data Retention And Archival Policy',
        componentType: 'box',
        component: <div>Data Retension</div>,
        navigation: {
            next: 'dedupe'
        }
    },
    {
        id: 'rollup',
        title: 'Rollup Configurations',
        description: 'Dedupe refers to the process of identifying and removing duplicate or redundant data entries within a dataset',
        component: <div>Rollup Configuration</div>,
        navigation: {
            next: 'denorm'
        }
    }
];