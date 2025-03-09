import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import "./index.scss";
import ButtonComponent from "../../atoms/button";

export interface ConfirmModalProps {
  open?: boolean;
  setOpen: (isOpen: boolean) => void;
  zIndexProps?: number | string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void; // Thêm prop onConfirm
  isLoading?: boolean; // Thêm prop isLoading
}

export default function ConfirmModal({
  open,
  setOpen,
  zIndexProps,
  title = "Title",
  message = "Message",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm, // Nhận prop
  isLoading, // Nhận prop
}: ConfirmModalProps) {
  const handleClose = () => {
    setOpen(false);
  };

  // Thêm hàm xử lý khi nhấn nút confirm
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div>
      <div
        onClick={handleClose}
        className={`confirm-modal__overlay${
          open ? " confirm-modal__overlay--visible" : ""
        }`}
      ></div>
      <div
        className={`confirm-modal${open ? " confirm-modal--open" : ""}`}
        style={{ zIndex: zIndexProps }}
      >
        <div className="confirm-modal__content">
          <div className="confirm-modal__content__cover">
            <div className="confirm-modal__content__cover__backdrop">
              <img
                src="https://t4.ftcdn.net/jpg/09/81/55/91/360_F_981559130_0V4GQsjVlf9C4Y7Q4M87Lj4VVcHo4S3L.jpg"
                alt=""
              />
              <div className="confirm-modal__content__cover__backdrop__close">
                {" "}
                <CloseOutlined onClick={handleClose} />{" "}
              </div>
            </div>
          </div>
          <div className="confirm-modal__content__body">
            <div className="confirm-modal__content__body__title">{title}</div>
            <div className="confirm-modal__content__body__message">
              <p>{message}</p>
            </div>
            <div className="confirm-modal__content__body__actions">
              <ButtonComponent
                status="success"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : confirmText}
              </ButtonComponent>
              <ButtonComponent onClick={handleClose} status="danger">
                {cancelText}
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
