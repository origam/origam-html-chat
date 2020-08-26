import React, { useMemo, useRef, useEffect, useContext } from "react";
import { SendMessageBar } from "../components/SendMessageBar";
import { Observer } from "mobx-react";
import { flow } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { CtxLocalUser } from "./Contexts";

export function SendMessageBarUI() {
  const localUser = useContext(CtxLocalUser);

  const handleKeyDown = useMemo(
    () => (event: any) => {
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          let text = event.target.value;
          text = text.trim();
          if (text.length > 0) {
            const id = uuidv4();
            //chatLog.appendLocalMessage(text, id);
            flow(function* () {
              //yield* api.sendMessage(chatroomSettings.chatroomId ?? "", "", { id: id, text });
            })();
          }
          event.target.value = "";
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
            onEditorKeyDown={handleKeyDown}
          />
        );
      }}
    </Observer>
  );
}
