import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const user = useSelector(state => state.user.user);
    console.log("user",user.userId)
    return user.userId ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;