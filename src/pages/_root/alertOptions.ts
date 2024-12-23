import {ToastContainerProps} from 'react-toastify';

export const alertOptions: ToastContainerProps = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'dark',
  limit: 3,
};
