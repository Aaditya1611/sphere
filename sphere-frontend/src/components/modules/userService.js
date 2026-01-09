import axios from "axios";
import { API_URL } from "../../API";

export const updateName = async (name) => {

    try {
        await axios.post(API_URL + "/savename", name);
        return { success: true };
    } catch (error) {
        console.error("An error occured updating the name", error)
        return { success: false, status: error.response?.status };
    }
}

export const updateBio = async (bio) => {

    try {
        await axios.post(API_URL + "/savebio", bio);
        return { success: true };
    } catch (error) {
        console.error("An error occured while updating the bio", error)
        return { success: false, status: error.response?.status };
    }
}

export const deleteUserAccount = async (userId) => {

    try {
        await axios.delete(`${API_URL}/deleteaccount/${userId}`)
        return { success: true };
    } catch (error) {
        console.error("An error occured while deleting your account")
        return { success: false, status: error.response?.status };
    }
}

export const searchFriend = async (email) => {

    try {
        const result = await axios.get(`${API_URL}/searchFriend/${email}`);
        return { success: true, data: result.data };
    } catch (error) {
        console.error("An error occured while searching searching for this user", error)
        return { success: false, status: error.response?.status };
    }
}

export const addNewFriend = async (friend) => {

    try {
        await axios.post(API_URL + "/addFriend", friend)
        return { success: true };
    } catch (error) {
        console.error("An error occured while adding a friend", error)
        return { success: false, status: error.response?.status };
    }
}

export const blockUsers = async (user) => {

    try {
        await axios.post(API_URL + "/blockUser", user)
        return { success: true };
    } catch (error) {
        console.error("An error occured while blocking a user", error)
        return { success: false, status: error.response?.status };
    }
}

export const getBlockedUsersList = async (userId) => {

    try {
        const result = await axios.get(`${API_URL}/getBlockedUsers/${userId}`);
        return { success: true, data: result.data };
    } catch (error) {
        console.error("An error occured while fetching the blocked users list", error)
        return { success: false, status: error.response?.status }
    }
}

export const unblockUser = async (blockedUser) => {

    try {
        await axios.post(API_URL + "/unblockUser", blockedUser);
        return { success: true };
    } catch (error) {
        console.error("An error occured while Unblocking this user", error)
        return { success: false, status: error.response?.status };
    }
}

export const getUserChats = async (userId, friendId) => {

    try {
        const response = await fetch(`${API_URL}/userChats/${userId}/${friendId}`)
        return (response).json()
    } catch (error) {
        console.error("Failed to fetch all the chats", error);
        throw error
    }
}

export const deleteUserChats = async (userchats) => {

    try {
        await axios.post(API_URL + "/user/chats/delete", userchats)
        return { success: true }
    } catch (error) {
        console.error("An error occured while deleting the chats", error)
        return { success: false, status: error.response?.status };
    }
}

export const uploadMedia = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`${API_URL}/uploadMediaFiles`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        return response.data.url;
    } catch (error) {
        console.error("Upload failed", error);
        return null;
    }
}