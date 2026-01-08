import { API_URL } from "../API";

export const getUserData = async (userId) => {

    try {
        const response = await fetch(`${API_URL}/profile/${userId}`);
        return (response).json();
    } catch(error){
        console.error("Failed to fetch the user details" , error);
        throw error
    }
}

export const getUserFriends = async (userId) => {

    try {
        const response = await fetch(`${API_URL}/userFriends/${userId}`)
        return (response).json()
    } catch (error) {
        console.error("Failed to fetch all the user Friends", error);
        throw error
    }
}