import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, status, Amount) => {

    switch (status) {

        case 'Validation':
            toast.info(message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Slide,
                style: { fontSize: '15px' }
            });
            break;

        case 'success':
            toast.success(message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Slide,
                style: { fontSize: '15px' }
            });
            break;

        case 'error':
            toast.error(message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Slide,
                style: { fontSize: '15px' }
            });
            break;
    }
};
