import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const RequiredSwitch = styled(Switch)(({ theme }) => ({
    // width: 52,
    // height: 30,
    // padding: 7,
    // '& .MuiSwitch-switchBase': {
    //     margin: 1,
    //     padding: 0,
    //     transform: 'translateX(6px)',
    //     '&.Mui-checked': {
    //         color: '#fff',
    //         transform: 'translateX(22px)',
    //         '& .MuiSwitch-thumb:before': {
    //             backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
    //                 '#000'
    //             )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
    //         },
    //         '& + .MuiSwitch-track': {
    //             backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
    //             opacity: 1,
    //             border: 0,
    //         },
    //         '&.Mui-disabled + .MuiSwitch-track': {
    //             opacity: 0.5,
    //         },
    //     },
    // },
    // '& .MuiSwitch-thumb': {
    //     backgroundColor: '#bef28a',
    //     width: 23,
    //     height: 25,
    //     marginTop: 1,
    //     '&:before': {
    //         content: "''",
    //         position: 'absolute',
    //         width: '100%',
    //         height: '100%',
    //         left: 0,
    //         top: 1,
    //         backgroundRepeat: 'no-repeat',
    //         backgroundPosition: 'center',
    //         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
    //             '#000'
    //         )}" d="M19,13H5V11H19V13Z" /></svg>')`,
    //     },
    // },
    // '&.Mui-disabled + .MuiSwitch-track': {
    //     opacity: 0.5,
    // },
    // '& .MuiSwitch-track': {
    //     borderRadius: 26 / 2,
    //     backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    //     opacity: 1,
    //     transition: theme.transitions.create(['background-color'], {
    //         duration: 500,
    //     }),
    // },
}));

export default RequiredSwitch;