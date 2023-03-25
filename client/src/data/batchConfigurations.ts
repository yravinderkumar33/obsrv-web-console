import * as yup from "yup";

export type stepQuestion = "batchConfiguration"

export interface questionSteps {
    id: stepQuestion,
    question: string,
    completed: boolean,
    rootQId: string,
    rootQValue: boolean,
    state: any,
    form: any
}

const batchConfig: Record<stepQuestion, questionSteps> = {
    batchConfiguration: {
        id: "batchConfiguration",
        question: "Does your data arrive in Batch? ",
        rootQId: 'isBatch',
        rootQValue: false,
        completed: false,
        form: {
            extractionKey: {
                required: true,
                value: '',
                validationSchema: yup.string().required("Value is required for the field"),
            },
            idForTheBatch: {
                required: true,
                value: '',
                validationSchema: yup.string().required("Value is required for the field"),
            },
            dedupeEvents: {
                required: false,
                value: [false, true],
            },
            dedupeKey: {
                required: true,
                value: '',
                dependsOn: {
                    key: 'dedupeEvents',
                    value: true
                },
                validationSchema: yup.string().when('dedupeEvents', {
                    is: true,
                    then: yup.string().required("Value is required for the field"),
                }),
            },
            dedupePeriod: {
                label: 'Dedupe Period in Days',
                required: true,
                value: '',
                dependsOn: {
                    key: 'dedupeEvents',
                    value: true
                },
                validationSchema: yup.number().when('dedupeEvents', {
                    is: true,
                    then: yup.number().required("Value is required for the field"),
                })
            },
            validateData: {
                required: true,
                value: [false, true],
            }
        },
        state: {
            dedupeEvents: false,
            dedupeKey: "",
            dedupePeriod: "",
            extractionKey: "",
            idForTheBatch: "",
            validateData: false,
        }
    },
};

export default batchConfig;
