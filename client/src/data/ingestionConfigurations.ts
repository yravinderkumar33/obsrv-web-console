import * as yup from "yup";

export type stepQuestion = "ingestionConfiguration"

export interface questionSteps {
    id: stepQuestion,
    question: string,
    completed: boolean,
    rootQId: string,
    rootQValue: string,
    rootQValues: string[],
    state: any,
    form: any
}

const ingestionConfig: Record<stepQuestion, questionSteps> = {
    ingestionConfiguration: {
        id: "ingestionConfiguration",
        question: "Select Ingestion Type ",
        rootQId: 'ingestionType',
        rootQValue: '',
        rootQValues: ['api', 'kafka'],
        completed: false,
        state: {
            api: null,
            kafka: {
                brokerUrls: ''
            }
        },
        form: {
            api: null,
            kafka: {
                brokerUrls: {
                    required: true,
                    value: '',
                    label: 'Comma Separated list of Broker URLs',
                    validationSchema: yup.string().required('Value is required for the field'),
                },
                topicName: {
                    required: true,
                    value: '',
                    label: 'Kafka Topic Name',
                    validationSchema: yup.string().required('Value is required for the field'),
                },
            }
        }
    },
};

export default ingestionConfig;
