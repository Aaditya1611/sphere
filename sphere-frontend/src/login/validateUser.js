import axios from "axios";
import { API_URL } from "../API";

export const login = async (userCredentials) => {

    try {
        const response = await axios.post(API_URL + "/login", userCredentials);
        return {success: true, data: response.data};
    } catch (error) {
        console.log("An error occured while loggin in", error);
        return {
            success: false, 
            status: error.response?.status || 500,
            errorMsg: error.response?.data || "An unexpected error happened"
        };
    }
} 