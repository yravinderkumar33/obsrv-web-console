import { Button, Typography } from "@mui/material";
import HtmlTooltip from "./HtmlTooltip";
import { interactIds } from "data/telemetry/interactIds";

interface Props {
    tooltipText: string;
    handleClick?: () => void;
    icon: any;
    buttonProps?: any;
    tooltipProps?: any;
    label?: string;
}

const IconButtonWithTips = ({ tooltipText, handleClick = () => { }, tooltipProps, buttonProps, label, icon, }: Props) => {
    return (
        <HtmlTooltip title={tooltipText} {...tooltipProps}>
            <Button id="" data-edataId={interactIds.button.icon.tooltip} data-edataType="INTERACT" data-objectId="1.0.0" data-objectType="iconButton" onClick={handleClick} startIcon={icon} {...buttonProps}>
                <Typography variant="body2" color="text.primary">{label}</Typography>
            </Button>
        </HtmlTooltip>
    );
}

export default IconButtonWithTips;
