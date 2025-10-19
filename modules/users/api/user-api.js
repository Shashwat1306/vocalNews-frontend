import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
export const doRegister = async (userData) => {
    console.log("API URL:", API_URL,"USER DATA:",userData); 
    return axios.post('/user/register',userData);
}
export const doLogin = async (userData) => {
    console.log("API URL:", API_URL,"USER DATA:",userData);
    return axios.post('/user/login',userData);
}
