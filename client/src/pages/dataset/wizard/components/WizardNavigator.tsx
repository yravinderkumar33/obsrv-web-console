import { DownloadOutlined } from '@ant-design/icons';
import { Button, Stack, Typography, Box, } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';

const WizardNavigator = ({ showPrevious, gotoPreviousSection, gotoNextSection, enableDownload, handleDownload, master }: any) => (
    <Stack direction="row" justifyContent={showPrevious ? 'flex-end' : 'space-between'}>
        {!showPrevious && gotoPreviousSection &&
            <AnimateButton>
                <Button data-edataid={`${master ? 'masterDataset' : 'dataset'}:list:columns:previous`} data-objectid="previous" data-objecttype={master ? 'masterDataset' : 'dataset'} variant="contained" sx={{ my: 1, mx: 1, width: 230, height: 44 }} type="button" onClick={gotoPreviousSection}>
                    <Typography variant="h5">Previous</Typography>
                </Button>
            </AnimateButton>
        }
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
            {enableDownload && handleDownload &&
                <AnimateButton>
                    <Button data-edataid={`${master ? 'masterDataset' : 'dataset'}:list:columns:previous`} data-objectid="downloadJSON" data-objecttype={master ? 'masterDataset' : 'dataset'} startIcon={<DownloadOutlined style={{ fontSize: '1.25rem' }} />} sx={{ my: 1, mx: 1, width: 278, height: 44 }} type="button" onClick={handleDownload} variant='outlined'>
                        <Typography variant="h5">Download JSON Schema</Typography>
                    </Button>
                </AnimateButton>
            }
            {gotoNextSection &&
                <AnimateButton>
                    <Button data-edataid="dataset:list:proceed" data-objectid="proceed" data-objecttype={master ? 'masterDataset' : 'dataset'} variant="contained" sx={{ my: 1, mx: 1, width: 230, height: 44 }} type="button" onClick={gotoNextSection}>
                        <Typography variant="h5">Proceed</Typography>
                    </Button>
                </AnimateButton>
            }
        </Box>
    </Stack>
);

export default WizardNavigator;
