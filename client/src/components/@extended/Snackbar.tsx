import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { Alert, Button, Fade, Grow, Slide, SlideProps } from '@mui/material';
import MuiSnackbar from '@mui/material/Snackbar';


import IconButton from './IconButton';


import { CloseOutlined } from '@ant-design/icons';

import { KeyedObject, RootStateProps } from 'types/root';
import { closeSnackbar } from 'store/reducers/snackbar';
import { interactIds } from 'data/telemetry/interactIds';


function TransitionSlideLeft(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
    return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
    return <Grow {...props} />;
}

const animation: KeyedObject = {
    SlideLeft: TransitionSlideLeft,
    SlideUp: TransitionSlideUp,
    SlideRight: TransitionSlideRight,
    SlideDown: TransitionSlideDown,
    Grow: GrowTransition,
    Fade
};

const Snackbar = () => {
    const dispatch = useDispatch();
    const snackbar = useSelector((state: RootStateProps) => state.snackbar);
    const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } = snackbar;

    const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeSnackbar());
    };

    return (
        <>
            {variant === 'default' && (
                <MuiSnackbar
                    anchorOrigin={anchorOrigin}
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message={message}
                    TransitionComponent={animation[transition]}
                    action={
                        <>
                            <Button
                                id="button"
                                data-edataid={interactIds.button.snackbar.undo}
                                data-objectid="snackbar:undo"
                                data-objecttype="snackbar"
                                color="secondary" size="small" onClick={handleClose}>
                                UNDO
                            </Button>
                            <IconButton
                                id="iconButton"
                                data-edataid={interactIds.button.snackbar.close}
                                data-objectid="snackbar:close:icon"
                                data-objecttype="snackbar"
                                size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mt: 0.25 }}>
                                <CloseOutlined />
                            </IconButton>
                        </>
                    }
                />
            )}

            {variant === 'alert' && (
                <MuiSnackbar
                    TransitionComponent={animation[transition]}
                    anchorOrigin={anchorOrigin}
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    sx={{ alignItems: 'center' }}
                >
                    <Alert
                        variant={alert.variant}
                        color={alert.color}
                        action={
                            <>
                                {actionButton !== false && (
                                    <Button
                                        id="button"
                                        data-edataid={interactIds.button.snackbar.undo}
                                        data-objectid="snackbar:undo"
                                        data-objecttype="snackbar"
                                        color={alert.color} size="small" onClick={handleClose}>
                                        UNDO
                                    </Button>
                                )}
                                {close !== false && (
                                    <IconButton
                                        id="iconButton"
                                        data-edataid={interactIds.button.snackbar.close}
                                        data-objectid="snackbar:close:icon"
                                        data-objecttype="snackbar"
                                        size="small"
                                        aria-label="close"
                                        variant="contained"
                                        color={alert.color}
                                        onClick={handleClose}
                                    >
                                        <CloseOutlined />
                                    </IconButton>
                                )}
                            </>
                        }
                        sx={{
                            ...(alert.variant === 'outlined' && {
                                bgcolor: 'grey.0'
                            })
                        }}
                    >
                        {message}
                    </Alert>
                </MuiSnackbar>
            )}
        </>
    );
};

export default Snackbar;
