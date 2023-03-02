import { useSelector, useDispatch } from 'react-redux';

const DatasetDetails = () => {

    const dataset = useSelector((state: any) => state.dataset)
    const dispatch = useDispatch();

    return <></>
};

export default DatasetDetails;
