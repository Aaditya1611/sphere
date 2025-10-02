import { API_URL } from "../API";

export const fetchUserData = async (userId) => {

    try {
        const response = await fetch(`${API_URL}/profile/${userId}`);
        if(!response.ok){
            throw new Error(`Error fetching user details ${response.Error}`)
        }
        return (response).json();
    } catch(error){
        console.error("fetchUserDetails error: ", error);
        throw error
    }
}
