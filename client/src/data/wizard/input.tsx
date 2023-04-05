
import { confirmationOptions } from "data/forms/common";
import ConditionalForm from "pages/dataset/wizard/components/ConditionalForm";
import { forms } from 'data/forms'

const dataFormatQues = {
    question: {
        name: "datasource",
        label: "Does Your Data Arrive In Batch ?",
        type: 'select',
        required: true,
        selectOptions: confirmationOptions
    },
    options: {
        yes: {
            form: forms.input_batch,
            description: "Select this option if you wish to send multiple events at once for this dataset."
        },
        no: {
            form: null,
            description: "Individual event mode is always enabled."
        }
    }
}

const datasourceQues = {
    question: {
        name: "question",
        label: "Select Your Input Data Source.",
        type: 'select',
        required: true,
        selectOptions: [
            {
                label: 'Kafka',
                value: 'kafka'
            },
            {
                label: 'API',
                value: 'api'
            },
        ]
    },
    options: {
        kafka: {
            form: forms.input_kafka,
            description: "Load streaming data in real-time from Apache Kafka. Configure topic name and list of Kafka brokers in the form: <BROKER_1>:<PORT_1>,<BROKER_2>:<PORT_2>,..."
        },
        api: {
            form: null,
            description: "API input is by enabled for all the datasets."
        }
    }
}

export const sections = [
    {
        id: 'dataSource',
        title: 'Input Data Sources',
        description: 'Read data from a wide variety of data sources. Batch and Real time data integration.',
        component: <ConditionalForm  {...datasourceQues} />,
        navigation: {
            next: 'dataFormat'
        }
    },
    {
        id: 'dataFormat',
        title: 'Input Data Formats',
        description: 'Decide how the data is ingested into the system.',
        component: <ConditionalForm  {...dataFormatQues} />
    }
];