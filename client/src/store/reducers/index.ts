// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import config from './config';
import dataset from './dataset';
import jsonSchema from './jsonSchema';
import wizard from './wizard';

const reducers = combineReducers({
  menu,
  snackbar,
  config,
  dataset,
  jsonSchema,
  wizard
});

export default reducers;
