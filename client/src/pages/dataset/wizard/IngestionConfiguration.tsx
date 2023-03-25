import SelectAccordion from "./components/SelectAccordion";
import ingestionConfig from "data/ingestionConfigurations";

export const pageMeta = { pageId: 'ingestionConfiguration', title: "Ingestion Configuration" };

const IngestionConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    return (
        <SelectAccordion
            handleBack={handleBack}
            handleNext={handleNext}
            setErrorIndex={setErrorIndex}
            index={index}
            configuration={ingestionConfig}
            pageMeta={pageMeta}
        />
    );
}

export default IngestionConfiguration;
