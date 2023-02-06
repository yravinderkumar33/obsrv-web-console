import { Button, Dialog, DialogContentText } from '@mui/material';
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AlertDialog = ({ handleClose, open = false, context = {} }: any) => {
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
                    <Button color="error" onClick={e => handleClose(false)}>
                        Disagree
                    </Button>
                    <Button variant="contained" onClick={e => handleClose(true)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    </>
}

export default AlertDialog;
