import React, { useMemo, useRef, useEffect } from "react";
import { SendMessageBar } from "../components/SendMessageBar";

export function SendMessageBarUI() {
  const handleKeyDown = useMemo(
    () => (event: any) => {
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          let text = event.target.value;
          text = text.trim();
          if (text.length > 0) {
            // chatLog.appendLocalMessage(text);
          }
          event.target.value = "";
        }
      }
    },
    []
  );

  return <SendMessageBar localUserName={"Pavel"} onEditorKeyDown={handleKeyDown} />;
}
