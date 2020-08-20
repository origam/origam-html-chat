import React from "react";

export function SendMessageBar(props: { onEditorKeyDown: any; localUserName: string }) {
  return (
    <div className="sendMessageBar">
      <div className="sendMessageBar__userName">{props.localUserName}:</div>
      <textarea onKeyDown={props.onEditorKeyDown} className="sendMessageBar__textarea" />
    </div>
  );
}
