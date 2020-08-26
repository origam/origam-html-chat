import React, { useMemo, useRef, useEffect, useContext, useState } from "react";
import { SendMessageBar } from "../components/SendMessageBar";
import { Observer } from "mobx-react";
import { flow } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { CtxLocalUser, CtxMessages, CtxAPI } from "./Contexts";
import moment from "moment";

export function SendMessageBarUI() {
  const api = useContext(CtxAPI);
  const localUser = useContext(CtxLocalUser);
  const messages = useContext(CtxMessages);

  const [isWorking, setIsWorking] = useState(false);

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
            onEditorKeyDown={handleKeyDown}
          />
        );
      }}
    </Observer>
  );
}
