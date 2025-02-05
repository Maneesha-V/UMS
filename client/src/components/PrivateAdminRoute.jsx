import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateAdminRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    if(!currentUser) {
        return <Navigate to='/admin/sign-in' />;
    }
    if(!currentUser.isAdmin) {
        return <Navigate to='/sign-in' />;
    }
  return <Outlet />
}

export default PrivateAdminRoute