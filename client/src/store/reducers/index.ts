// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import config from './config';
import dataset from './dataset';
import wizard from './wizard';

const reducers = combineReducers({
  menu,
  snackbar,
  config,
  dataset,
  wizard
});

export default reducers;
