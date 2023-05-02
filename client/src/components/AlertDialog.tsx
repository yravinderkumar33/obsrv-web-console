import { Button, Dialog, DialogContentText } from '@mui/material';
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { interactIds } from 'data/telemetry/interactIds';

const AlertDialog = ({ handleClose, action = null, open = false, context = {} }: any) => {

    const handleAction = () => {
        if (action) action();
        handleClose(true);
    }

    return <>
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle >{context?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {context?.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button data-edataId={interactIds.alert.dialog.cancel} data-edataType="INTERACT" data-objectId="1.0.0" data-objectType="alertDialog" color="error" onClick={e => handleClose()}>
                        Cancel
                    </Button>
                    <Button data-edataId={interactIds.alert.dialog.agree} data-edataType="INTERACT" data-objectId="1.0.0" data-objectType="alertDialog" variant="contained" onClick={handleAction} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    </>
}

export default AlertDialog;
