import React, {
  useMemo,
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { SendMessageBar } from "../components/SendMessageBar";
import { Observer } from "mobx-react";
import { flow } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { CtxLocalUser, CtxMessages, CtxAPI } from "./Contexts";
import moment from "moment";
import draftToHtml from "draftjs-to-html";
import {
  convertToRaw,
  EditorState,
  ContentState,
  EditorChangeType,
} from "draft-js";

export function SendMessageBarUI() {
  const api = useContext(CtxAPI);
  const localUser = useContext(CtxLocalUser);
  const messages = useContext(CtxMessages);

  const [isWorking, setIsWorking] = useState(false);
  const [editorState, setEditorState] = useState<any>();
  const [initialEditorState] = useState(() => editorState);
  const handleEditorReturn = useMemo(
    () => (event: any) => {
      console.log("return");
      if (event.ctrlKey && event.altKey) {
        const content = editorState.getCurrentContent();
        if (content.hasText()) {
          const htmlState = draftToHtml(convertToRaw(content));
          console.log(htmlState);
          const id = uuidv4();
          messages.pushLocalMessage({
            id,
            authorId: localUser.id,
            authorAvatarUrl: localUser.avatarUrl,
            authorName: localUser.name,
            text: htmlState,
            timeSent: moment().toISOString(),
            mentions: [],
          });
          flow(function* () {
            try {
              setIsWorking(true);
              yield api.sendMessage({ id, mentions: [], text: htmlState });
            } finally {
              setIsWorking(false);
              setEditorState(EditorState.createEmpty());
            }
            //yield* api.sendMessage(chatroomSettings.chatroomId ?? "", "", { id: id, text });
          })();
        }
        return "handled";
      } else {
        return "not-handled";
      }
    },
    [editorState]
  );

  const handleKeyDown = useMemo(
    () => (event: any) => {
      event.persist();
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          let text = event.target.value;
          text = text.trim();
          if (text.length > 0) {
            const id = uuidv4();
            messages.pushLocalMessage({
              id,
              authorId: localUser.id,
              authorAvatarUrl: localUser.avatarUrl,
              authorName: localUser.name,
              text,
              timeSent: moment().toISOString(),
              mentions: [],
            });
            flow(function* () {
              try {
                setIsWorking(true);
                yield api.sendMessage({ id, mentions: [], text });
              } finally {
                setIsWorking(false);
                event.target.value = "";
              }
              //yield* api.sendMessage(chatroomSettings.chatroomId ?? "", "", { id: id, text });
            })();
          }
        }
      }
    },
    []
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
          />
        );
      }}
    </Observer>
  );
}
