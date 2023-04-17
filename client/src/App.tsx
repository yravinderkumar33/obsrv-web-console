import Routes from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';

const App = () => (
  <ThemeCustomization>
    <Locales>
      <ScrollTop>
        <>
          <Routes />
          <Snackbar />
        </>
      </ScrollTop>
    </Locales>
  </ThemeCustomization>
);

export default App;
