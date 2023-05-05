import Google from 'assets/images/auth/google.svg';
import Keycloak from 'assets/images/auth/keycloak.svg';
import pageIds from 'data/telemetry/pageIds';
import { generateStartEvent } from 'services/telemetry';

export default [
    {
        value: "Google",
        label: "Google",
        edataId: "login_google",
        icon: <img src={Google} alt="Google" />,
        onClick: () => {
            generateStartEvent({
                edata: {
                    type: "socialLogin:google",
                    pageid: pageIds.login, 
                },
                object: {}
            });
        }
    },
    {
        value: "Keycloak",
        label: "Keycloak",
        edataId: "login_keycloak",
        icon: <img src={Keycloak} alt="Keycloak" />,
        onClick: () => {
            generateStartEvent({
                edata: {
                    type: "socialLogin:keycloak",
                    pageid: pageIds.login, 
                },
                object: {}
            });
        }
    }
]
