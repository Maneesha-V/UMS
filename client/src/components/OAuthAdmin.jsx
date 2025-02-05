import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OAuthAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleAdminGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log("Google Auth", result);

            const res = await fetch('/api/auth/admin/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();
            console.log("Response", data);

            if (res.status === 403) {
                toast.error("Access Denied: You are not an admin.");
                return;
            }

            dispatch(signInSuccess(data));
            navigate('/admin/dashboard'); 
        } catch (err) {
            toast.error("Could not login with Google.");
            console.error("Could not login with Google:", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleAdminGoogleClick}
            className="bg-blue-700 text-lg text-white uppercase p-3 rounded-lg hover:opacity-90"
        >
            Continue as Admin with Google
        </button>
    );
};

export default OAuthAdmin;
