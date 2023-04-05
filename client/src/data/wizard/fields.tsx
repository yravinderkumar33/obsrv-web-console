import { FieldTimeOutlined } from "@ant-design/icons";
import InputAccordion from "pages/dataset/wizard/components/InputAccordion";
import TimestampSelection from "pages/dataset/wizard/components/TimestampSelection";
import AddPIIDialog from "pages/dataset/wizard/components/transformationDialogs/AddPII";
import AddTransformationExpression from "pages/dataset/wizard/components/transformationDialogs/AddTransformationExpression";

const actions = [{ label: 'Mask', component: '', value: 'mask' }, { label: 'Encrypt', component: '', value: 'encrypt' }];

export const sections = [
    {
        id: 'timestamp',
        title: 'Timestamp Field',
        description: 'Timestamp Field specifies the column or field that contains the timestamp for each data record being ingested. This enabled our platform to effectively partition, index, and query data based on the timestamps.',
        componentType: 'box',
        icon: FieldTimeOutlined,
        component: <TimestampSelection />,
        navigation: {
            next: 'pii'
        }
    },
    {
        id: 'pii',
        title: 'PII Fields',
        description: 'PII is sensitive information that needs to be protected and kept secure to prevent identity theft, fraud, or other types of harm.  PII fields are often identified and tagged to ensure that appropriate controls are in place to protect the data',
        component: <InputAccordion actions={actions} label={'Add PII'} dialog={< AddPIIDialog />} />,
        navigation: {
            previous: 'timestamp',
            next: 'transformation'
        }
    },
    {
        id: 'transformation',
        title: 'Fields Transformation',
        description: 'Field transformations allows users to manipulate and transform data during ingestion or query time',
        component: <InputAccordion actions={[...actions, { label: 'Custom', component: '', value: 'custom' }]} label={'Add Transformation'} dialog={< AddTransformationExpression />} />,
        navigation: {
            previous: 'pii'
        }
    }
];