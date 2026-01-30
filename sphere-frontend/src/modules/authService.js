import { API_URL } from "../api/API_URL";
import api from "../api/api";

export const sendOtp = async (email) => {

    try {

        await api.post(API_URL + "/sendOtp", null, {
            params: {
                email
            }
        })
        return true;
    } catch (error) {
        console.log("Error encountered while sending OTP: ", error)
        return false;
    }
}

export const verifyOtp = async (email, otp) => {

    try {

        await api.post(API_URL + "/verifyOtp", null, {
            params: {
                email,
                otp
            }
        })
        return true;
    } catch (error) {
        console.log("Errors encountered while verifying OTP: ", error)
        return false;
    }
}

export const signup = async (userPayload) => {

    try {
        const response = await api.post(API_URL + "/signup", userPayload)
        return {success: true, data: response.data};
    } catch (error) {
        console.log("Signup failed: ", error)
        return {success: false, status: error?.response.status}
    }
}