import { Box } from '@mui/material';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import WizardBreadcrumbs from 'components/@extended/WizardBreadCrumbs';
import navigation from 'menu-items';
// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({ wizard = false }) => (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
        {wizard && <WizardBreadcrumbs />}
        {!wizard && <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />}
    </Box>
);

export default Search;
