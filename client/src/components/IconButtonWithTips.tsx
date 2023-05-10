import { Button, Typography } from "@mui/material";
import HtmlTooltip from "./HtmlTooltip";
import  interactIds  from "data/telemetry/interact.json";

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
            <Button data-edataid={`${interactIds.button_icon_tooltip}:${tooltipText}`} onClick={handleClick} startIcon={icon} {...buttonProps}>
                <Typography variant="body2" color="text.primary">{label}</Typography>
            </Button>
        </HtmlTooltip>
    );
}

export default IconButtonWithTips;
