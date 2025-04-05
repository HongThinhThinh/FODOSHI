import Swal from "sweetalert2";

import "sweetalert2/src/sweetalert2.scss";
export const alertSuccess = (message) => {
  Swal.fire({
    title: "Congratulations !!",
    text: `${message}`,
    icon: "success",
  });
};
export const alertSuccessSignUp = (message) => {
  Swal.fire({
    title: "SignUp Successfully!",
    text: `${message}`,
    icon: "success",
  });
};

export const alertFail = (message, title = "Oops...") => {
  Swal.fire({
    icon: "error",
    title: `${title}`,
    text: `${message}`,
  });
};