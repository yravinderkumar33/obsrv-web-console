import Routes from 'routes';
import _ from 'lodash';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import { useEffect } from 'react';
import { addHttpRequestsInterceptor, errorInterceptor, responseInterceptor } from 'services/http';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { telemetry } from 'services/telemetry';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onClick = (event: any) => {
    const target = _.get(event, 'target');
    const dataset = _.get(target, 'dataset');

    if(!(target && dataset)) return;
    const { edataid, edataversion = '1.0.0', edatatype, objectid, objecttype, objectversion = '1.0.0' } = ({...dataset} || {}) as Record<string, any>;

    const edata = { id: edataid || target.id, type: edatatype, ver: edataversion || '1.0.0'};

      const object = {
      ...(objectid &&
        objecttype && {
            objectid,
            objecttype,
            objectversion
        })
      };
      if(target.hasAttribute('id')){  
      telemetry.interact(edata, object);
      }
  }

  useEffect(() => { 
    const { hash, key, pathname, search, state} = location;
    const impressionData = {
      id: key,
      type: '',
      pageId: pathname,
      uri: pathname
    };

    telemetry.impression(impressionData, {});
  }, [location]);

  useEffect(() => {
    addHttpRequestsInterceptor({ responseInterceptor, errorInterceptor: errorInterceptor({ navigate, dispatch }) })
  }, [])

  return <div onClick={onClick}>
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

  </div>
}

export default App;
