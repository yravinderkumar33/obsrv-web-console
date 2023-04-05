
import { confirmationOptions } from "data/forms/common";
import ConditionalForm from "pages/dataset/wizard/components/ConditionalForm";
import { forms } from 'data/forms';
import * as _ from 'lodash';
import { flattenSchema } from "services/json-schema";

const dedupeQues = {
    question: {
        name: "question",
        label: "Dedupe Events ?",
        type: 'select',
        required: true,
        selectOptions: confirmationOptions
    },
    options: {
        yes: {
            form: forms.input_dedupe,
            description: "Select Dedupe properties"
        },
        no: {
            form: null,
            description: null
        }
    }
}

const validateQues = {
    question: {
        name: "question",
        label: "Validate Data ?",
        type: 'select',
        required: true,
        selectOptions: confirmationOptions
    },
    options: {
        yes: {
            form: forms.input_validateData,
            description: "Select Validation Type"
        },
        no: {
            form: null,
            description: null
        }
    }
}


const transformer = (formMeta: Array<Record<string, any>>, context: Record<string, any>) => {
    const schema = _.get(context, 'redux.jsonSchema.data.schema');
    if (!schema) return formMeta;
    const flattenedData = flattenSchema(schema);
    return formMeta;
}


export const sections = [
    {
        id: 'dataValidation',
        title: 'Data Validation',
        description: 'Data Validation Type',
        component: <ConditionalForm  {...validateQues} />,
        navigation: {
            next: 'dedupe'
        }
    },
    {
        id: 'dedupe',
        title: 'Dedupe Events',
        description: 'Dedupe refers to the process of identifying and removing duplicate or redundant data entries within a dataset',
        component: <ConditionalForm transform={transformer} {...dedupeQues} />
    }
];