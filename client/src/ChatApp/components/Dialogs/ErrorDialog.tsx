import React from "react";
import {
  ModalCloseButton,
  DefaultModal,
  ModalFooter,
} from "../Windows/Windows";
import { Button } from "../Buttons";
import { IModalHandle } from "../Windows/WindowsSvc";
import { T } from "util/translation";

export function renderErrorDialog(exception: any) {
  return (modal: IModalHandle<any>) => (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button onClick={() => modal.resolveInteract()}>Ok</Button>
        </ModalFooter>
      }
    >
      <ModalCloseButton onClick={() => modal.resolveInteract()} />
      <div>{T("There has been an error", "error_occured")}:</div>
      <textarea
        className="errorDialog__textarea"
        value={exception?.message ?? "" + exception}
        readOnly={true}
      />
    </DefaultModal>
  );
}
