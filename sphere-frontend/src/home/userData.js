import { API_URL } from "../API";

export const fetchUserData = async (userId) => {

    try {
        const response = await fetch(`${API_URL}/profile/${userId}`);
        return (response).json();
    } catch(error){
        console.error("Failed to fetch the user details" , error);
        throw error
    }
}

export const fetchUserFriends = async (userId) => {

    try {
        const response = await fetch(`${API_URL}/getFriends/${userId}`)
        return (response).json()
    } catch (error) {
        console.error("Failed to fetch all the user Friends", error);
        throw error
    }
}

export const fetchUserChats = async (userId, friendId) => {

    try {
        //TO DO
    } catch {
        //TO DO
    }   
}
