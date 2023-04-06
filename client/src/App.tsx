import Routes from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';

const App = () => (
  <ThemeCustomization>
    <Locales>
      <ScrollTop>
        <AuthProvider>
          <>
            <Routes />
            <Snackbar />
          </>
        </AuthProvider>
      </ScrollTop>
    </Locales>
  </ThemeCustomization>
);

export default App;
