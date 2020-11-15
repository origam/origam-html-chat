import React, { useContext, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CtxMentionUserWorkflow } from "../componentIntegrations/Contexts";
import { UserToMention } from "./Dialogs/MentionUserDialog";
import { Entity, Modifier, EditorState } from "draft-js";
import { CtxHashtagRootStore } from "../modules/hashtagging/components/Common";

export function SendMessageBar(props: {
  //onEditorKeyDown: any;
  localUserName: string;
  isWorking?: boolean;
  editorState: any;
  onEditorStateChange: any;
  onHandleReturn: any;
  onSendMessageClick: any;
}) {
  useEffect(() => {
    setTimeout(() => {}, 5000);
  }, []);

  function mentionUsers(users: UserToMention[]) {
    console.log("Mentioning...");
    let editorState = props.editorState;
    for (let user of users) {
      let currentContent = editorState.getCurrentContent();
      let currentSelection = editorState.getSelection();
      const newEntityKey = Entity.create("MENTION", "IMMUTABLE", {
        text: `@${user.name}`,
        url: `@${user.name}`,
        value: `${user.id}`,
      });
      const textWithEntity = Modifier.insertText(
        currentContent,
        currentSelection,
        `@${user.name}`,
        undefined,
        newEntityKey
      );
      editorState = EditorState.push(
        editorState,
        textWithEntity,
        "insert-characters"
      );
      currentContent = editorState.getCurrentContent();
      currentSelection = editorState.getSelection();
      editorState = EditorState.push(
        editorState,
        Modifier.insertText(currentContent, currentSelection, " "),
        "insert-characters"
      );
    }
    props.onEditorStateChange?.(editorState);
  }

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
        toolbarClassName="sendMessageEditorToolbar"
        wrapperClassName=""
        editorClassName=""
        toolbarOnFocus={true}
        toolbarCustomButtons={[
          <MentionButton onUsersMentioned={mentionUsers} />,
          <HashtagButton />,
        ]}
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
            "link",
            //"embedded",
            "emoji",
            //"image",
            "remove",
            "history",
          ],
        }}
      />
      <button
        className="sendMessageBar__sendBtn"
        onClick={props.onSendMessageClick}
      >
        <i className="far fa-paper-plane fa-lg" />
      </button>
    </div>
  );
}

export function MentionButton(props: {
  onUsersMentioned?: (users: UserToMention[]) => void;
}) {
  const mentionWorkflow = useContext(CtxMentionUserWorkflow);
  return (
    <button
      onClick={() =>
        mentionWorkflow.start((users) => props.onUsersMentioned?.(users))
      }
      className="mentionButton"
    >
      @
    </button>
  );
}

export function HashtagButton(props: {}) {
  const hashtagRootStore = useContext(CtxHashtagRootStore);
  return (
    <button
      className="hashtagButton"
      onClick={() =>
        hashtagRootStore.screenProcess.start((ht) => {
          console.log(ht);
        })
      }
    >
      #
    </button>
  );
}
