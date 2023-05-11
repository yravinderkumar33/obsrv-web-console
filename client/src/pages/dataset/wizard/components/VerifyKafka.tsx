import { error, success } from 'services/toaster';
import { LinkOutlined } from '@ant-design/icons';
import * as _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import { verifyKafkaConnection } from 'services/dataset';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import interactIds from 'data/telemetry/interact.json';

const VerifyKafka = (props: any) => {
    const { generateInteractTelemetry } = props;
    const dispatch = useDispatch();
    const state: any = useSelector((state: any) => state);
    const connectorInfo: any = _.get(state, ['wizard', 'pages', 'dataSource', 'value']);
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        generateInteractTelemetry({ edata: { id: interactIds.verify_kafka_connection } });
        setLoading(true);
        try {
            const data = await verifyKafkaConnection(connectorInfo);
            const { connectionEstablished, topicExists } = data.data.result;
            if (connectionEstablished && topicExists) {
                dispatch(success({ message: "Connection established successfully" }));
            }
            else if (!topicExists) {
                dispatch(error({ message: "Topic does not exist" }));
            }
            setLoading(false);
        } catch (err) {
            dispatch(error({ message: "Failed to establish connection to the client" }));
            setLoading(false);
        }
    }

    return (
        <LoadingButton
            onClick={_ => testConnection()}
            variant="outlined"
            color="primary"
            loading={loading}
            endIcon={<LinkOutlined />}
            loadingPosition='end'
            sx={{ fontWeight: 500, verticalAlign: 'top', }}
            size="large"
        >
            Test connection
        </LoadingButton>
    );
}

export default VerifyKafka;
