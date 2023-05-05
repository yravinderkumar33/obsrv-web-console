import { Button, Dialog, DialogContentText } from '@mui/material';
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import interactIds from 'data/telemetry/interact.json';

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
                    <Button data-edataid={interactIds.alert_dialog_cancel} data-objectid="dialog:cancel" data-objecttype="alertDialog" color="error" onClick={e => handleClose()}>
                        Cancel
                    </Button>
                    <Button data-edataid={interactIds.alert_dialog_agree} data-objectid="dialog:agree" data-objecttype="alertDialog" variant="contained" onClick={handleAction} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    </>
}

export default AlertDialog;
