import { confirmationOptions } from "data/forms/common";
import ConditionalCheckboxForm from "pages/dataset/wizard/components/ConditionalCheckboxBasedForm";
import ConditionalForm from "pages/dataset/wizard/components/ConditionalForm";
import { forms } from 'data/forms';
import DataRetentionAndArchival from "pages/dataset/wizard/components/DataRetentionAndArchival";
import RollupConfiguration from "pages/dataset/wizard/components/RollupConfiguration";

const retentionQues = {
    question: {
        name: "question",
        label: "Configure Retention Period ?",
        type: 'select',
        required: true,
        selectOptions: confirmationOptions
    },
    options: {
        yes: {
            form: forms.advanced_retention,
            description: "Select Retention Period in Days"
        },
        no: {
            form: null,
            description: null
        }
    }
}

export const sections = [
    {
        id: 'dataRention',
        title: 'Data Retention And Archival',
        description: 'Data Retention & Archival policy is a set of guidelines that outline how long an organization must keep its data before it can be deleted. Archival policy refers to the process of moving data to a separate storage system or medium for long-term retention and access.',
        component: <DataRetentionAndArchival pageId="advanced" />,
        componentType: 'box',
        navigation: {
            next: 'rollup'
        }
    },
    {
        id: 'rollup',
        title: 'Rollup Configurations',
        description: 'Rollup configurations are used to define the pre-aggregation of data for faster queries and reduced storage costs. Rollup configurations are defined at the ingestion time and involve specifying how to group data by certain dimensions and aggregate metrics.',
        component: <RollupConfiguration pageId="advanced" />,
    }
];
