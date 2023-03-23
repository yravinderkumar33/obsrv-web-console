// material-ui
import { Theme } from '@mui/material/styles';

// assets
import { RightCircleOutlined } from '@ant-design/icons';

// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function AccordionSummary(theme: Theme) {
    const { palette, spacing } = theme;

    return {
        MuiAccordionSummary: {
            defaultProps: {
                expandIcon: <RightCircleOutlined style={{ fontSize: '1.25rem' }} />
            },
            styleOverrides: {
                root: {
                    backgroundColor: palette.secondary.lighter,
                    minHeight: 46
                },
                expandIconWrapper: {
                    '&.Mui-expanded': {
                        transform: 'rotate(90deg)'
                    }
                },
                content: {
                    marginTop: spacing(1.25),
                    marginBottom: spacing(1.25),
                    marginLeft: spacing(1)
                }
            }
        }
    };
}
