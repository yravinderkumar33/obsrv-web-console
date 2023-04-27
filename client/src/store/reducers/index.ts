
import { combineReducers } from 'redux';


import menu from './menu';
import snackbar from './snackbar';
import config from './config';
import dataset from './dataset';
import wizard from './wizard';
import alerts from './alerts'

const reducers = combineReducers({
  menu,
  snackbar,
  config,
  dataset,
  wizard,
  alerts
});

export default reducers;
