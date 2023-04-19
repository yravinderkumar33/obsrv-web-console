import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';



const DrawerContent = ({ handleDrawerToggle = () => { } }) => (
    <SimpleBar
        sx={{
            '& .simplebar-content': {
                display: 'flex',
                flexDirection: 'column'
            }
        }}
    >
        <Navigation handleDrawerToggle={handleDrawerToggle} />
    </SimpleBar>
);

export default DrawerContent;
