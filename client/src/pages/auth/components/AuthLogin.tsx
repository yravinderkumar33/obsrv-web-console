import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useDispatch } from 'react-redux';
import { error } from 'services/toaster';
import { useSearchParams } from 'react-router-dom';
import LoginForm from './LoginForm';
import { TabPanel } from 'pages/dataset/wizard/UploadFiles';


const AuthLogin = () => {
  const dispatch = useDispatch();
  const allowedAuthTypes = process.env.REACT_APP_AUTHENTICATION_ALLOWED_TYPES || 'obsrv';
  
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(0);
  const loginView = (allowedAuthTypes.includes("obsrv") && allowedAuthTypes.includes("ad")) ? "tabs" : "non-tabs"

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const getLoginType = () => {
    if(allowedAuthTypes.includes("obsrv")) {
      return "obsrv"
    } else if(allowedAuthTypes.includes("ad")) {
      return "ad"
    } else {
      return ""
    }
  }

  useEffect(() => {
    const err = searchParams.get('err');
    if (err) {
      dispatch(error({ message: err }));
    }
  }, []);

  return (
    <>
     { (loginView === "tabs") ? 
     <>
     <Tabs variant="fullWidth" value={tabIndex} onChange={handleTabChange} >
        <Tab
          label={"Login with Obsrv"} />
        <Tab
          label={"Login with AD"} />
      </Tabs> 
      <TabPanel index={0} value={tabIndex}>
          <LoginForm type={"obsrv"}/>
      </TabPanel>
      <TabPanel  index={1} value={tabIndex}>
        <LoginForm type={"ad"}/>
      </TabPanel>
      </>
      :
        <LoginForm type={getLoginType()}/>
    }
    </>
  );
};

export default AuthLogin;
