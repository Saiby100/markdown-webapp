import { toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: false,
    theme: "light",
    transition: Bounce
}

const showToast = {
    success(msg, options=defaultOptions) {
        return toast.success(msg, {
            ...options
        });
    },

    error(msg, options=defaultOptions) {
        return toast.error(msg, {
            ...options
        });
    },

    info(msg, options=defaultOptions) {
        return toast.info(msg, {
            ...options
        })
    }
}

export default showToast;