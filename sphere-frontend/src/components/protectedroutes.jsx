import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { userData, loading } = useContext(UserContext);

    if(loading) return <div>Loading...</div>
    return userData ? <Outlet /> : <Navigate to="/" replace />
};

export default ProtectedRoute;