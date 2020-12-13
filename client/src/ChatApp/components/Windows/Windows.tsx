import React, { PropsWithChildren } from "react";
import cx from "classnames";
import { Button } from "../Buttons";
import { IModalHandle } from "./WindowsSvc";
import { BigSpinner } from "../BigSpinner";
import { T } from "util/translation";

export function Overlay(props: PropsWithChildren<{}>) {
  return <div className="appOverlay">{props.children}</div>;
}

export function FullscreenCentered(props: PropsWithChildren<{}>) {
  return <div className="appCentered">{props.children}</div>;
}

export function DefaultModal(
  props: PropsWithChildren<{
    footer?: React.ReactNode;
    additionalClassName?: string;
  }>
) {
  return (
    <div className={cx("appModal", props.additionalClassName)}>
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
  noClose?: boolean;
  noOk?: boolean;
}) {
  return (
    <DefaultModal
      footer={
        !props.noOk ? (
          <ModalFooter align="center">
            <Button onClick={props.onClose}>{T("Ok", "Ok")}</Button>
          </ModalFooter>
        ) : null
      }
    >
      {!props.noClose && <ModalCloseButton onClick={props.onClose} />}
      {props.message}
    </DefaultModal>
  );
}

export function SimpleProgress(props: {
  message?: React.ReactNode;
  onCancel?: any;
}) {
  return (
    <DefaultModal
      additionalClassName="simpleProgress"
      footer={
        props.onCancel ? (
          <ModalFooter align="center">
            <Button onClick={props.onCancel}>{T("Cancel", "Cancel")}</Button>
          </ModalFooter>
        ) : null
      }
    >
      {props.message}
      <BigSpinner />
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
            {T("Cancel", "Cancel")}
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

export function renderSimpleQuestion(message: React.ReactNode) {
  return (modal: IModalHandle<{ isOk?: boolean; isCancel?: boolean }>) => {
    return (
      <SimpleQuestion
        message={message}
        onOk={() => modal.resolveInteract({ isOk: true })}
        onCancel={() => modal.resolveInteract({ isCancel: true })}
      />
    );
  };
}

export function renderSimpleInformation(
  message: React.ReactNode,
  noClose?: boolean,
  noOk?: boolean
) {
  return (modal: IModalHandle<{}>) => {
    return (
      <SimpleMessage
        message={message}
        noClose={noClose}
        noOk={noOk}
        onClose={() => modal.resolveInteract({})}
      />
    );
  };
}

export function renderSimpleProgress(message?: React.ReactNode) {
  return (modal: IModalHandle<{}>) => {
    return <SimpleProgress message={message} />;
  };
}
