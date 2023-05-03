import Google from 'assets/images/auth/google.svg';
import Keycloak from 'assets/images/auth/keycloak.svg';

export default [
    {
        value:"Google",
        label: "Google",
        icon: <img src={Google} alt="Google" />,
        onClick:() => {
            
        }
    },
    {
        value:"Keycloak",
        label:"Keycloak",
        icon: <img src={Keycloak} alt="Keycloak" />,
        onClick:() => {

        }
    }
]
