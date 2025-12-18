import axios from "axios";
import { API_URL } from "../API";

export const login = async (userCredentials) => {

    return await axios.post(API_URL + "/login", userCredentials);
} 