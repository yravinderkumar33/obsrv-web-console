import { error, success } from 'services/toaster';
import { LinkOutlined } from '@ant-design/icons';
import * as _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import { verifyKafkaConnection } from 'services/dataset';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { interactIds } from 'data/telemetry/interactIds';

type colors = "success" | "error" | "inherit" | "primary" | "secondary" | "info" | "warning";

const VerifyKafka = () => {
    const dispatch = useDispatch();
    const state: any = useSelector((state: any) => state);
    const connectorInfo: any = _.get(state, ['wizard', 'pages', 'dataSource', 'value']);
    const [loading, setLoading] = useState(false);
    const [buttonColor, setButtonColor] = useState<colors>("success");

    const testConnection = async () => {
        setLoading(true);
        try {
            const data = await verifyKafkaConnection(connectorInfo);
            const { connectionEstablished, topicExists } = data.data.result;
            if (connectionEstablished && topicExists) {
                setButtonColor("success");
                dispatch(success({ message: "Connection established successfully" }));
            }
            else if (!topicExists) {
                setButtonColor("error");
                dispatch(error({ message: "Topic does not exist" }));
            }
            setLoading(false);
        } catch (err) {
            setButtonColor("error");
            dispatch(error({ message: "Failed to establish connection to the client" }));
            setLoading(false);
        }
    }

    return (
        <LoadingButton
            data-edataid={interactIds.kafka.verify}
            data-objectid="kafka:testConnection"
            data-objecttype="dataset"
            onClick={_ => testConnection()}
            variant="contained"
            color={buttonColor}
            loading={loading}
            endIcon={<LinkOutlined />}
            loadingPosition='end'
        >
            <span>Test connection</span>
        </LoadingButton>
    );
}

export default VerifyKafka;
