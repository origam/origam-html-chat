import React, { useContext } from "react";
import { Observer } from "mobx-react";
import {
  MessageCluster,
  IMessageClusterDirection,
} from "../components/MessageCluster";
import { Message } from "../components/Message";
import { MessageHeader } from "../components/MessageHeader";
import moment from "moment";
import { Message as MessageModel } from "../model/Messages";
import { getAvatarUrl } from "../helpers/avatar";
import { CtxMessages, CtxLocalUser } from "./Contexts";

export function ChatFeedUI() {
  const messages = useContext(CtxMessages);
  const localUser = useContext(CtxLocalUser);
  return (
    <Observer>
      {() => {
        function makeMessageDirection(message: MessageModel) {
          if (localUser.id === message.authorId)
            return IMessageClusterDirection.Outbound;
          else return IMessageClusterDirection.Inbound;
        }

        function makeMessageClusters() {
          let clusterNodes: React.ReactNode[] = [];
          let messageNodes: React.ReactNode[] = [];
          let lastMessage: MessageModel | undefined;

          for (let messageItem of messages.items) {
            if (!lastMessage || lastMessage.authorId !== messageItem.authorId) {
              messageNodes = [];
              clusterNodes.push(
                <MessageCluster
                  key={messageItem.id}
                  avatar={
                    <img
                      className="avatar__picture"
                      src={getAvatarUrl(messageItem.authorAvatarUrl)}
                    />
                  }
                  direction={makeMessageDirection(messageItem)}
                  header={
                    <MessageHeader
                      personName={messageItem.authorName}
                      messageDateTime={moment(messageItem.timeSent).format(
                        "D.M.YYYY HH:mm:ss"
                      )}
                    />
                  }
                  body={<>{messageNodes}</>}
                />
              );
            }
            messageNodes.push(
              <Message
                key={messageItem.id}
                content={
                  <span
                    onClick={(evt) => evt.preventDefault()}
                    className="dangerousContent"
                    dangerouslySetInnerHTML={{ __html: messageItem.text }}
                  />
                }
                isInsertedByClient={messageItem.isLocalOnly}
              />
            );
            lastMessage = messageItem;
          }
          return clusterNodes;
        }

        return (
          <>
            {makeMessageClusters()}
          </>
        );
      }}
    </Observer>
  );
}
