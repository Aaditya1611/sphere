import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    useEffect(() => {
        if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
        setLoading(false);
    }, [userData]);

    // useEffect(() => {
    //     const checkSession = async () => {
    //         const token = localStorage.getItem("token");
    //         const savedUser = localStorage.getItem("userData");

    //         if (token && savedUser) {
    //             // OPTIONAL: Verify token with backend if you want to be extra secure
    //             // try {
    //             //     await api.get("/auth/verify-token"); 
    //             //     setUser(JSON.parse(savedUser));
    //             // } catch (err) {
    //             //     logout();
    //             // }

    //             // For now, trust the local storage (Faster)
    //             setUser(JSON.parse(savedUser));
    //         }
    //         setLoading(false);
    //     };

    //     checkSession();
    // }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserContext.Provider>
    );
};