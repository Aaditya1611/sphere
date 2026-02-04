import { API_URL } from "../api/API_URL";
import api from "../api/api";

export const updateName = async (name) => {

    try {
        await api.post(API_URL + "/savename", name);
        return { success: true };
    } catch (error) {
        console.error("An error occured updating the name", error)
        return { success: false, status: error.response?.status };
    }
}

export const updateBio = async (bio) => {

    try {
        await api.post(API_URL + "/savebio", bio);
        return { success: true };
    } catch (error) {
        console.error("An error occured while updating the bio", error)
        return { success: false, status: error.response?.status };
    }
}

export const deleteUserAccount = async (userId) => {

    try {
        await api.delete(`${API_URL}/deleteaccount/${userId}`)
        return { success: true };
    } catch (error) {
        console.error("An error occured while deleting your account")
        return { success: false, status: error.response?.status };
    }
}

export const searchFriend = async (email) => {

    try {
        const result = await api.get(`${API_URL}/searchFriend/${email}`);
        return { success: true, data: result.data };
    } catch (error) {
        console.error("An error occured while searching searching for this user", error)
        return { success: false, status: error.response?.status };
    }
}

export const addNewFriend = async (friend) => {

    try {
        await api.post(API_URL + "/addFriend", friend)
        return { success: true };
    } catch (error) {
        console.error("An error occured while adding a friend", error)
        return { success: false, status: error.response?.status };
    }
}

export const blockUsers = async (user) => {

    try {
        await api.post(API_URL + "/blockUser", user)
        return { success: true };
    } catch (error) {
        console.error("An error occured while blocking a user", error)
        return { success: false, status: error.response?.status };
    }
}

export const getBlockedUsersList = async (userId) => {

    try {
        const result = await api.get(`${API_URL}/getBlockedUsers/${userId}`);
        return { success: true, data: result.data };
    } catch (error) {
        console.error("An error occured while fetching the blocked users list", error)
        return { success: false, status: error.response?.status }
    }
}

export const unblockUser = async (blockedUser) => {

    try {
        await api.post(API_URL + "/unblockUser", blockedUser);
        return { success: true };
    } catch (error) {
        console.error("An error occured while Unblocking this user", error)
        return { success: false, status: error.response?.status };
    }
}

export const getUserChats = async (userId, friendId, pageNum=0) => {

    try {
        const response = await api.get(`${API_URL}/userChats/${userId}/${friendId}?page=${pageNum}`)
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all the chats", error);
        throw error
    }
}

export const deleteUserChats = async (userchats) => {

    try {
        await api.post(API_URL + "/user/chats/delete", userchats)
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
        const response = await api.post(`${API_URL}/uploadMediaFiles`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.url;
    } catch (error) {
        console.error("Upload failed", error);
        return null;
    }
}

export const uploadProfilePic = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post(`${API_URL}/uploadProfilePic`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.url;
    } catch (error) {
        console.error("Profile pic upload failed", error);
        return null;
    }
}

export const updateProfilePicUrl = async (id, url) => {

    try {
        const response = await api.post(`${API_URL}/updateProfilePicUrl`, null, {
            params: {
                id: id,
                url: url
            }
        });
        return response.status;
    } catch (error) {
        console.error("Profile pic url update failed", error);
        throw error;
    }
}