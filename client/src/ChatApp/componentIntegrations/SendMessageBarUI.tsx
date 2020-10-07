import Draft, { convertToRaw, EditorState } from "draft-js";
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

export function SendMessageBarUI() {
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
      if (!event.ctrlKey) {
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
        setEditorState(EditorState.createEmpty());
        flow(function* () {
          try {
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
