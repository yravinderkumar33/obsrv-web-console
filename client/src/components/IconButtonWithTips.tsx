import { IconButton } from "@mui/material";
import HtmlTooltip from "./HtmlTooltip";


interface Props {
    tooltipText: string;
    handleClick: () => void;
    icon: React.ReactElement<any, any>;
    buttonProps?: any;
    tooltipProps?: any;
}

const IconButtonWithTips = ({ tooltipText, handleClick, icon, tooltipProps, buttonProps }: Props) => {
    return (
        <HtmlTooltip title={tooltipText} {...tooltipProps}>
            <IconButton onClick={handleClick} {...buttonProps}>
                {icon}
            </IconButton>
        </HtmlTooltip>
    );
}

export default IconButtonWithTips;
