import { createContext, useState, useEffect, Children } from "react";

export const UserContext = createContext(null);

export const UserProvider= ({ children }) => {

    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if(userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    );
};