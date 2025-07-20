import { createRoot } from "react-dom/client";
import ConfirmToast from "./ui";

let resolvePromise;
let toastRoot;

const showConfirmToast = (message, callback) => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    if (!toastRoot) {
      const toastContainer = document.createElement("div");
      document.body.appendChild(toastContainer);
      toastRoot = createRoot(toastContainer);
    }

    toastRoot.render(
      <ConfirmToast show={true} message={message} onHide={handleCancel} onConfirm={() => handleConfirm(callback)} />
    );
  });
};

const handleConfirm = (callback) => {
  if (callback) {
    callback();
  }

  resolvePromise(true);
  clearToast();
};

const handleCancel = () => {
  resolvePromise(false);
  clearToast();
};

const clearToast = () => {
  if (toastRoot) {
    toastRoot.render(<></>);
  }
};

export default showConfirmToast;