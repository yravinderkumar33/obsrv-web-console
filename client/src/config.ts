// types
import { DefaultConfigProps } from 'types/config';

export const drawerWidth = 260;

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const FIREBASE_API = {
  apiKey: 'AIzaSyC74w_JCigORyepa_esLkPt-B3HgtI_X3o',
  authDomain: 'mantis-4040b.firebaseapp.com',
  projectId: 'mantis-4040b',
  storageBucket: 'mantis-4040b.appspot.com',
  messagingSenderId: '1073498457348',
  appId: '1:1073498457348:web:268210e18c8f2cab30fc51',
  measurementId: 'G-7SP8EXFS48'
};

// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
  defaultPath: '/',
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'theme7',
  themeDirection: 'ltr'
};

export default config;
