import { DownloadOutlined } from '@ant-design/icons';
import { Stack, Typography, Box, } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { StandardWidthButton } from 'components/styled/Buttons';

const WizardNavigator = ({ pageId, showPrevious, gotoPreviousSection, gotoNextSection, enableDownload, handleDownload, master, section = undefined, nextDisabled = true }: any) => (
    <Stack direction="row" justifyContent={showPrevious ? 'space-between' : 'flex-end'}>
        {showPrevious && gotoPreviousSection &&
            <AnimateButton>
                <StandardWidthButton
                    data-edataid={`${master ? 'masterDataset' : 'dataset'}:${pageId}:${section ? section + ':' : ''}previous`}
                    data-objectid="previous"
                    data-objecttype={master ? 'masterDataset' : 'dataset'}
                    variant="outlined"
                    type="button"
                    onClick={gotoPreviousSection}
                >
                    <Typography variant="h5">Previous</Typography>
                </StandardWidthButton>
            </AnimateButton>
        }
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
            {enableDownload && handleDownload &&
                <AnimateButton>
                    <StandardWidthButton
                        data-edataid={`${master ? 'masterDataset' : 'dataset'}:${pageId}:${section ? section + ':' : ''}downloadJson`}
                        data-objectid="downloadJSON"
                        data-objecttype={master ? 'masterDataset' : 'dataset'}
                        startIcon={<DownloadOutlined style={{ fontSize: '1.25rem' }} />}
                        sx={{ width: 'auto' }}
                        type="button"
                        onClick={handleDownload}
                        variant='outlined'
                    >
                        <Typography variant="h5">Download JSON Schema</Typography>
                    </StandardWidthButton>
                </AnimateButton>
            }
            {gotoNextSection &&
                <AnimateButton>
                    <StandardWidthButton
                        data-edataid={`${master ? 'masterDataset' : 'dataset'}:${pageId}:${section ? section + ':' : ''}proceed`}
                        data-objectid="proceed"
                        data-objecttype={master ? 'masterDataset' : 'dataset'}
                        variant="contained"
                        type="button"
                        onClick={gotoNextSection}
                        disabled={nextDisabled}
                    >
                        <Typography variant="h5">Proceed</Typography>
                    </StandardWidthButton>
                </AnimateButton>
            }
        </Box>
    </Stack>
);

export default WizardNavigator;
