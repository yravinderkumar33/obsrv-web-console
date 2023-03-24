import { Box, FormControl } from '@mui/material';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import navigation from 'menu-items';
// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => (
  <Box sx={{ width: '100%', ml: { xs: 0, md: 1, p: 0 }, margin: 'auto' }}>
      <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
  </Box>
);

export default Search;
