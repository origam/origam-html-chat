import _ from "lodash";
import { action, computed, flow, observable } from "mobx";
import { Observer } from "mobx-react";
import React, { useContext, useEffect, useState } from "react";
import { AutoSizer, List } from "react-virtualized";
import { CtxAPI, CtxWindowsSvc } from "../../componentIntegrations/Contexts";
import { getAvatarUrl } from "../../helpers/avatar";
import { ChatHTTPApi } from "../../services/ChatHTTPApi";
import { Button } from "../Buttons";
import { TagInput, TagInputItem, TagInputItemClose } from "../TagInput";
import {
  DefaultModal,
  ModalCloseButton,
  ModalFooter,
} from "../Windows/Windows";
import { IModalHandle, WindowsSvc } from "../Windows/WindowsSvc";
import { renderErrorDialog } from "./ErrorDialog";

export interface IInteractor {
  chatroomTopic?: string;
  isCancel?: boolean;
}

class DialogState {
  constructor(public api: ChatHTTPApi, public windowsSvc: WindowsSvc) {
    console.log("Creating new dialog state.");
  }

  @observable chatroomTopic: string = "";

  @action.bound
  handleChatroomTopicChange(event: any) {
    this.chatroomTopic = event.target.value;
  }
}

export function RenameChatroomDialog(props: {
  onCancel?: any;
  onSubmit?: (chatroomTopic: string) => void;
}) {
  const api = useContext(CtxAPI);
  const windowsSvc = useContext(CtxWindowsSvc);
  const [state] = useState(() => new DialogState(api, windowsSvc));
  return (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button onClick={() => props.onSubmit?.(state.chatroomTopic)}>
            Ok
          </Button>
        </ModalFooter>
      }
    >
      <div className="chooseUserToInviteModalContent">
        <div className="chooseUserToInviteModalContent__header">
          <p>Enter new topic for this chatroom:</p>
          <Observer>
            {() => (
              <input
                value={state.chatroomTopic}
                onChange={state.handleChatroomTopicChange}
                className="chatroomTopicInput"
                placeholder="Set chatroom topic"
              />
            )}
          </Observer>
        </div>
      </div>
    </DefaultModal>
  );
}

export function renderRenameChatroomDialog() {
  return (modal: IModalHandle<IInteractor>) => {
    return (
      <RenameChatroomDialog
        onCancel={() => modal.resolveInteract({ isCancel: true })}
        onSubmit={(chatroomTopic) => modal.resolveInteract({ chatroomTopic })}
      />
    );
  };
}
