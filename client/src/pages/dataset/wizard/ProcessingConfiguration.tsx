import BooleanAccordion from "./components/BooleanAccordion";
import batchConfig from "data/batchConfigurations";

export const pageMeta = { pageId: 'processingConfiguration', title: "Processing Configuration" };

const ProcessingConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    return (
        <BooleanAccordion
            handleBack={handleBack}
            handleNext={handleNext}
            setErrorIndex={setErrorIndex}
            index={index}
            configuration={batchConfig}
            pageMeta={pageMeta}
        />
    );
}

export default ProcessingConfiguration;
