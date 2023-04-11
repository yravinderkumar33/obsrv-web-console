
import JSONata from 'jsonata';
import MainCard from "components/MainCard";
import ReactDiffViewer from "react-diff-viewer";
import { useSelector } from 'react-redux';
import * as _ from "lodash";
import { useEffect, useState } from 'react';
import { Alert, Stack } from '@mui/material';
import { WarningOutlined } from '@ant-design/icons';

const PreviewTransformation = ({ fieldName, expression, title = 'Preview Transformation' }: any) => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonData: any = _.get(wizardState, ['pages', 'datasetConfiguration', 'state', 'data']);
    const [previewState, setPreviewState] = useState<any>('');

    const previewTransformation = async () => {
        const ata = JSONata(expression);
        const data = await ata.evaluate(jsonData[0]);
        let sample = _.cloneDeep(jsonData[0]);
        sample[fieldName] = data;
        setPreviewState(sample);
    }

    useEffect(() => {
        previewTransformation();
    }, [fieldName, expression]);

    if (fieldName && expression)
        return (
            <MainCard content={false} title={title}>
                <Stack direction="column">
                    <ReactDiffViewer
                        oldValue={JSON.stringify(jsonData[0], null, 2)}
                        newValue={JSON.stringify(previewState, null, 2)}
                        splitView
                        showDiffOnly
                    />
                </Stack>
            </MainCard>
        );
    else return (<Alert color="error" icon={<WarningOutlined />}>Error performing transformation</Alert>);
}

export default PreviewTransformation;
