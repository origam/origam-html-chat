/*
Copyright 2005 - 2021 Advantage Solutions, s. r. o.

This file is part of ORIGAM (http://www.origam.org).

ORIGAM is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ORIGAM is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ORIGAM. If not, see <http://www.gnu.org/licenses/>.
*/

import Draft, { convertToRaw, EditorState } from "draft-js";
import { clearEditorContent } from "draftjs-utils";
import draftToHtml from "draftjs-to-html";
import { flow } from "mobx";
import { Observer } from "mobx-react";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SendMessageBar } from "../components/SendMessageBar";
import { CtxAPI, CtxLocalUser, CtxMessages } from "./Contexts";

const getEntities = (editorState: any, entityType: any = null) => {
  const content = editorState.getCurrentContent();
  const entities: any[] = [];
  content.getBlocksAsArray().forEach((block: any) => {
    let selectedEntity: any = null;
    block.findEntityRanges(
      (character: any) => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: content.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      (start: any, end: any) => {
        entities.push({ ...selectedEntity, start, end });
      }
    );
  });
  return entities;
};

export function SendMessageBarUI(props: {
  onMessageWillSend?(msg: string): void;
}) {
  const api = useContext(CtxAPI);
  const localUser = useContext(CtxLocalUser);
  const messages = useContext(CtxMessages);

  const [isWorking, setIsWorking] = useState(false);
  const [editorState, setEditorStateRaw] = useState<any>(() =>
    EditorState.createEmpty()
  );
  const [initialEditorState] = useState(() => editorState);

  const setEditorState = (state: any) => {
    // console.log(convertToRaw(state.getCurrentContent()));
    setEditorStateRaw(state);
  };
  const handleEditorReturn = useMemo(
    () => (event: any) => {
      // console.log("return");
      if (!event.ctrlKey && !event.shiftKey) {
        sendMessage();
        return "handled";
      } else {
        return "not-handled";
      }
    },
    [editorState]
  );

  const handleSendMessageClick = useMemo(
    () => (event: any) => {
      sendMessage();
    },
    [editorState]
  );

  const sendMessage = useMemo(
    () => () => {
      const content = editorState.getCurrentContent();
      if (content.hasText()) {
        const entities = getEntities(editorState, "MENTION");
        const htmlState = draftToHtml(convertToRaw(content));
        props.onMessageWillSend?.(htmlState);
        // console.log(htmlState);
        const mentions = entities.map((item) => item.entity.getData().value);
        const id = uuidv4();
        messages.pushLocalMessage({
          id,
          authorId: localUser.id,
          authorAvatarUrl: localUser.avatarUrl,
          authorName: localUser.name,
          text: htmlState,
          timeSent: moment().toISOString(),
          mentions,
        });

        flow(function* () {
          try {
            setEditorState(clearEditorContent(editorState));
            setIsWorking(true);
            yield api.sendMessage({ id, mentions, text: htmlState });
          } finally {
            setIsWorking(false);
          }
          //yield* api.sendMessage(chatroomSettings.chatroomId ?? "", "", { id: id, text });
        })();
      }
    },
    [editorState]
  );

  return (
    <Observer>
      {() => {
        const localUserName = localUser.name;

        return (
          <SendMessageBar
            localUserName={localUserName}
            editorState={editorState}
            onEditorStateChange={setEditorState}
            onHandleReturn={handleEditorReturn}
            onSendMessageClick={handleSendMessageClick}
          />
        );
      }}
    </Observer>
  );
}
