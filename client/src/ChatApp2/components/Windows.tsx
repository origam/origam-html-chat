import React, { PropsWithChildren } from "react";
import cx from "classnames";
import { Button } from "./Buttons";

export function Overlay(props: PropsWithChildren<{}>) {
  return <div className="appOverlay">{props.children}</div>;
}

export function FullscreenCentered(props: PropsWithChildren<{}>) {
  return <div className="appCentered">{props.children}</div>;
}

export function DefaultModal(
  props: PropsWithChildren<{ footer?: React.ReactNode }>
) {
  return (
    <div className="appModal">
      <div className="appModal__body">{props.children}</div>
      {props.footer}
    </div>
  );
}

export function ModalFooter(
  props: PropsWithChildren<{ align: "left" | "center" | "right" }>
) {
  return (
    <div
      className={cx("appModal__footer", {
        "appModal__footer--leftAligned": props.align === "left",
        "appModal__footer--centerAligned": props.align === "center",
        "appModal__footer--rightAligned": props.align === "right",
      })}
    >
      {props.children}
    </div>
  );
}

export function ModalCloseButton(props: { onClick?: any }) {
  return (
    <div className="appModal__close" onClick={props.onClick}>
      <i className="fas fa-times" />
    </div>
  );
}

export function SimpleMessage(props: {
  onClose?: any;
  message: React.ReactNode;
}) {
  return (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button onClick={props.onClose}>Ok</Button>
        </ModalFooter>
      }
    >
      <ModalCloseButton onClick={props.onClose} />
      {props.message}
    </DefaultModal>
  );
}

export function SimpleQuestion(props: {
  onOk?: any;
  onCancel?: any;
  onClose?: any;
  message: React.ReactNode;
}) {
  return (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button
            onClick={() => {
              props.onOk?.();
              props.onClose?.();
            }}
          >
            Ok
          </Button>
          <Button
            onClick={() => {
              props.onCancel?.();
              props.onClose?.();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      }
    >
      <ModalCloseButton
        onClick={() => {
          props.onCancel?.();
          props.onClose?.();
        }}
      />
      {props.message}
    </DefaultModal>
  );
}
