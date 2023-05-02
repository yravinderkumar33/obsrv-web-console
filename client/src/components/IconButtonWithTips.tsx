import { IconButton } from "@mui/material";
import HtmlTooltip from "./HtmlTooltip";
import { interactIds } from "data/telemetry/interactIds";


interface Props {
    tooltipText: string;
    handleClick?: () => void;
    icon: React.ReactElement<any, any>;
    buttonProps?: any;
    tooltipProps?: any;
}

const IconButtonWithTips = ({ tooltipText, handleClick = () => { }, icon, tooltipProps, buttonProps }: Props) => {
    return (
        <HtmlTooltip title={tooltipText} {...tooltipProps}>
            <IconButton
            id=""
            data-edataId={interactIds.button.icon.tooltip}
            data-edataType="INTERACT"
            data-objectId="1.0.0"
            data-objectType="iconButton"
            onClick={handleClick} {...buttonProps}>
                {icon}
            </IconButton>
        </HtmlTooltip>
    );
}

export default IconButtonWithTips;
