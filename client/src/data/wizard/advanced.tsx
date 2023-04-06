import ConditionalCheckboxForm from "pages/dataset/wizard/components/ConditionalCheckboxBasedForm";
import ConditionalForm from "pages/dataset/wizard/components/ConditionalForm";

export const sections = [
    {
        id: 'dataRention',
        title: 'Data Retention And Archival',
        description: 'Data Retention & Archival policy is a set of guidelines that outline how long an organization must keep its data before it can be deleted. Archival policy refers to the process of moving data to a separate storage system or medium for long-term retention and access.',
        component: <div>Data Retension</div>,
        navigation: {
            next: 'rollup'
        }
    },
    {
        id: 'rollup',
        title: 'Rollup Configurations',
        description: 'Rollup configurations are used to define the pre-aggregation of data for faster queries and reduced storage costs. Rollup configurations are defined at the ingestion time and involve specifying how to group data by certain dimensions and aggregate metrics.',
        component: <div>Rollup Configuration</div>,
    }
];