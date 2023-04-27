import other from './home';
import datasets from './datasets'
import { NavItemType } from 'types/menu';
import profile from './profile';

const menuItems: { items: NavItemType[] } = {
  items: [other, datasets, profile]
};

export default menuItems;
