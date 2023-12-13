import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Toast = (prop, message) => {
  toast.configure();
  if (prop == "error") {
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  } else if (prop == "success") {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
};

export default Toast;
