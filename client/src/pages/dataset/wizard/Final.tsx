import * as _ from 'lodash'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { updateJSONSchema } from 'services/json-schema';
import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';

const Final = () => {
  const [state, setState] = useState(null)
  const wizardState: any = useSelector((state: any) => state?.wizard);
  const jsonSchema: any = useSelector((state: any) => state?.jsonSchema);

  useEffect(() => {
    if (jsonSchema?.status === 'success') {
      const updated = updateJSONSchema(jsonSchema?.data, { schema: wizardState?.pages?.columns?.state?.schema, configurations: wizardState?.pages?.configurations?.state?.configurations });
      setState(updated);
    }
  }, [])

  return (
    <>
      <JSONInput
        placeholder={state}
        width='100%'
        locale={locale}
        colors={{
          string: "#DAA520"
        }}
      />
    </>
  );
};

export default Final;
