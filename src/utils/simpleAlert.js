import Swal from "sweetalert2";

export default function SimpleAlert(message, text, type, timmer) {
    Swal.fire({
        icon: type,
        title: `${message}`,
        text: text,
        showConfirmButton: false,
        timer: timmer ? timmer : 2500
    })

    return true;
}