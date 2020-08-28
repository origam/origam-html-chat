import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export function SendMessageBar(props: {
  //onEditorKeyDown: any;
  localUserName: string;
  isWorking?: boolean;
  editorState: any;
  onEditorStateChange: any;
  onHandleReturn: any;
}) {
  return (
    <div className="sendMessageBar">
      <div className="sendMessageBar__userName">{props.localUserName}:</div>
      {/*<textarea
        onKeyDown={props.onEditorKeyDown}
        className="sendMessageBar__textarea"
        readOnly={props.isWorking}
      />*/}

      <Editor
        editorState={props.editorState}
        {...({
          handleReturn: props.onHandleReturn,
        } as any)}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        toolbarOnFocus={true}
        onEditorStateChange={props.onEditorStateChange}
        toolbar={{
          inline: {
            options: [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "monospace",
              //"subscript",
              //"superscript"
            ],
          },
          options: [
            "inline",
            //"blockType",
            //"fontSize",
            //"fontFamily",
            //"list",
            //"textAlign",
            //"colorPicker",
            //"link",
            //"embedded",
            "emoji",
            //"image",
            "remove",
            "history",
          ],
        }}
        mention={{
          separator: " ",
          trigger: "@",
          suggestions: [
            { text: "APPLE", value: "apple", url: "apple" },
            { text: "BANANA", value: "banana", url: "banana" },
            { text: "CHERRY", value: "cherry", url: "cherry" },
            { text: "DURIAN", value: "durian", url: "durian" },
            { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
            { text: "FIG", value: "fig", url: "fig" },
            { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
            { text: "HONEYDEW", value: "honeydew", url: "honeydew" },
          ],
        }}
      />
    </div>
  );
}
