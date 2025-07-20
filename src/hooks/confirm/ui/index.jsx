import React from "react";
import { Toast, Button } from "react-bootstrap";
import styles from "./style.module.css";

const ConfirmToast = ({ show, message, onHide, onConfirm }) => {
  return (
    <>
      {show && <div className={styles.toastBackdrop}></div>}
      <Toast show={show} onClose={onHide} className={`position-fixed top-50 start-50 translate-middle p-2 ${styles.toastBox}`}>
        <Toast.Header className="border-0 p-0" closeButton={false}>
          <button type="button" className="btn-close ms-auto me-1" onClick={onHide} aria-label="Close"></button>
        </Toast.Header>
        <Toast.Body className="border-0 p-2">
          <div dangerouslySetInnerHTML={{ __html: message ? message : '<span>Bạn có chắc chắn muốn tiếp tục?</span>' }}></div>
          <div className="mt-2 pt-3 d-flex justify-content-center gap-2">
            <Button variant="primary" size="sm" onClick={onConfirm}>
              Đồng ý
            </Button>
            <Button variant="danger" size="sm" onClick={onHide}>
              Hủy bỏ
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default ConfirmToast;