import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button, Typography } from '@mui/material';
import { forms } from 'data/forms'
import ConditionalCheckboxForm from "pages/dataset/wizard/components/ConditionalCheckboxBasedForm";
import { downloadJSONFile } from 'services/utils';
import VerifyKafka from 'pages/dataset/wizard/components/VerifyKafka';
import { generateSample } from 'data/sampleBatchEvent';
import DataKeySelection from 'pages/dataset/wizard/components/DataKeySelection';
import { interactIds } from 'data/telemetry/interactIds';

const downloadBatchConfig = () => {
    downloadJSONFile(generateSample("observations"), "sampleBatchConfig.json");
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
            topComponent: <>
                <Button
                    data-edataid={interactIds.button.download}
                    data-objectid="dataset:download:batchEvents"
                    data-objecttype="wizard:dataset"
                    onClick={_ => downloadBatchConfig()}
                    variant="text"
                    sx={{ my: 0.5, fontSize: '1.25rem' }}
                    startIcon={<FileDownloadOutlinedIcon fontSize='inherit' />}
                >
                    <Typography variant="h6">
                        Download Sample Batch Event
                    </Typography>
                </Button>
            </>
        }
    ]
}

const datasourceQues = {
    type: 'checkbox',
    justifyContents: 'flex-start',
    name: 'datasource',
    fields: [
        {
            name: "datasource",
            label: "API",
            value: "api",
            selected: true,
            required: true,
            disabled: true,
            description: "API input is by enabled for all datasets.",
            form: null
        },
        {
            name: "datasource",
            label: "Kafka",
            value: "kafka",
            required: true,
            form: forms.input_kafka,
            description: "Load streaming data in real-time from Apache Kafka. Configure topic name and list of Kafka brokers in the form: <BROKER_1>:<PORT_1>,<BROKER_2>:<PORT_2>,...",
            formComponent: <VerifyKafka />,
        },
    ]
}

export const sections = [
    {
        id: 'dataKey',
        title: 'Data key',
        description: 'Select the key from your data for denormalization.',
        component: <DataKeySelection />,
        master: true,
        componentType: 'box',
        navigation: {
            next: 'dataSource'
        },
    },
    {
        id: 'dataSource',
        title: 'Input Data Sources',
        description: 'Read data from a wide variety of data sources. Batch and Real time data integration.',
        component: <ConditionalCheckboxForm key="datasource" {...datasourceQues} />,
        componentType: 'box',
        navigation: {
            next: 'dataFormat'
        }
    },
    {
        id: 'dataFormat',
        title: 'Input Data Formats',
        description: 'Decide how the data is ingested into the system.',
        component: <ConditionalCheckboxForm key="dataformat" {...dataFormatQues} />
    }
];
