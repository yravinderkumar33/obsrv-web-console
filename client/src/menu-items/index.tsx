// project import
import other from './home';
import datasets from './datasets'
import { NavItemType } from 'types/menu';


// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [other, datasets]
};

export default menuItems;
