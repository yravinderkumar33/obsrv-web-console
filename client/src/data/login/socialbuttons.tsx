import Google from 'assets/images/auth/google.svg';
import Keycloak from 'assets/images/auth/keycloak.svg';

export default [
    {
        value: "Google",
        label: "Google",
        edataId: "login_google",
        icon: <img src={Google} alt="Google" />,
        onClick: () => {

        }
    },
    {
        value: "Keycloak",
        label: "Keycloak",
        edataId: "login_keycloak",
        icon: <img src={Keycloak} alt="Keycloak" />,
        onClick: () => {

        }
    }
]
