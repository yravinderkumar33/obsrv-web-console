import { DownloadOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';
import { forms } from 'data/forms'
import ConditionalCheckboxForm from "pages/dataset/wizard/components/ConditionalCheckboxBasedForm";
import sampleBatchConfig from 'data/sampleBatchEvent.json';
import { downloadJSONFile } from 'services/utils';
import apiEndpoints from 'data/apiEndpoints';
import { v4 } from "uuid";

const downloadBatchConfig = () => {
    downloadJSONFile(sampleBatchConfig, "sampleBatchConfig.json");
}

const dataFormatQues = {
    name: 'isBatch',
    justifyContents: 'flex-start',
    type: 'checkbox',
    fields: [
        {
            name: "isBatch",
            label: "Individual Events",
            value: "no",
            required: true,
            selected: true,
            disabled: true,
            description: "Individual event mode is always enabled.",
            form: null
        },
        {
            name: "isBatch",
            label: "Batch Mode",
            value: "yes",
            required: true,
            form: forms.input_batch,
            description: "Select this option if you wish to send multiple events at once for this dataset.",
            component: <>
                <Button onClick={_ => downloadBatchConfig()} variant="contained" startIcon={<DownloadOutlined />}>Download Sample Batch Event</Button>
            </>
        }
    ]
}

const datasourceQues = {
    type: 'checkbox',
    justifyContents: 'flex-start',
    name: 'datasource',
    defaultValues: {
        datasource: {
            extractionKey: "events",
            batchId: "123",
            dedupeRequired: "yes",
            dedupePeriod: 7
        }
    },
    fields: [
        {
            name: "datasource",
            label: "API",
            value: "api",
            selected: true,
            required: true,
            disabled: true,
            description: "API input is by enabled for all the datasets.",
            form: null
        },
        {
            name: "datasource",
            label: "Kafka",
            value: "kafka",
            required: true,
            form: forms.input_kafka,
            description: "Load streaming data in real-time from Apache Kafka. Configure topic name and list of Kafka brokers in the form: <BROKER_1>:<PORT_1>,<BROKER_2>:<PORT_2>,...",
        }
    ]
}

export const sections = [
    {
        id: 'dataSource',
        title: 'Input Data Sources',
        description: 'Read data from a wide variety of data sources. Batch and Real time data integration.',
        component: <ConditionalCheckboxForm {...datasourceQues} />,
        componentType: 'box',
        navigation: {
            next: 'dataFormat'
        }
    },
    {
        id: 'dataFormat',
        title: 'Input Data Formats',
        description: 'Decide how the data is ingested into the system.',
        component: <ConditionalCheckboxForm {...dataFormatQues} />
    }
];
