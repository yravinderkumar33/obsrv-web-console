import apiEndpoints from "data/apiEndpoints";
import { http } from 'services/http'
import { error } from "./toaster";

export const logout = async (config: Record<string, any>) => {
    const { dispatch, navigate } = config;
    try {
        await http.get(apiEndpoints.logout);
        navigate('/login');
    } catch (err) {
        dispatch(error({ message: "Failed to logout" }));
    }
}