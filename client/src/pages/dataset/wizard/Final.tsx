import * as _ from 'lodash'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import { updateJSONSchema } from 'services/json-schema';


const Final = () => {
  const [state, setState] = useState(null)
  const wizardState: any = useSelector((state: any) => state?.wizard);
  const jsonSchema: any = useSelector((state: any) => state?.jsonSchema);


  useEffect(() => {
    if (jsonSchema?.status === 'success') {
      const updated = updateJSONSchema(jsonSchema?.data, { schema: wizardState?.pages?.columns?.state?.schema, configurations: wizardState?.pages?.configurations?.state?.configurations });
      setState(updated)

    }
  }, [])

  return (
    <>
      {
        JSON.stringify(state)
      }
    </>
  );
};

export default Final;
