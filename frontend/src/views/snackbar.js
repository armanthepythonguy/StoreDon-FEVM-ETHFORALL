import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function MessageSnackbar({ open, autoHideDuration, onClose, message, severity }) {
    return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%', top: 0 }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
export default MessageSnackbar;
