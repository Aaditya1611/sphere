import { API_URL } from "../api/API_URL";
import api from "../api/api";

export const getUserData = async (userId) => {

    try {
        const response = await api.get(`${API_URL}/profile/${userId}`);
        return response.data;
    } catch(error){
        console.error("Failed to fetch the user details" , error);
        throw error
    }
}

export const getUserFriends = async (userId) => {

    try {
        const response = await api.get(`${API_URL}/userFriends/${userId}`)
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all the user Friends", error);
        throw error
    }
}