import React, { useContext } from "react";
import { IChatLogItem, IMessageDirection, IMessageGroup } from "../ChatLog";
import { Observer } from "mobx-react";
import { MessageCluster, MessageClusterDirection } from "../components/MessageCluster";
import { Message } from "../components/Message";
import { MessageHeader } from "../components/MessageHeader";
import moment from "moment";
import { CtxChatLog, CtxChatParticipants } from "../App";

function feedDirection2messageDirection(dir: IMessageDirection) {
  if (dir === IMessageDirection.Inbound) return MessageClusterDirection.Inbound;
  return MessageClusterDirection.Outbound;
}

let gernGroupId = 0;

export function ChatFeedMessageGroup(props: { group: IMessageGroup }) {
  const chatParticipants = useContext(CtxChatParticipants);
  const participant = chatParticipants.getById(props.group.sender);
  return (
    <Observer>
      {() => {
        const group = props.group;
        return (
          <MessageCluster
            key={group.$id}
            avatar={<img className="avatar__picture" src={participant?.avatarUrl} />}
            direction={feedDirection2messageDirection(group.direction)}
            header={
              <MessageHeader personName={participant?.name} messageDateTime={moment(group.timeSent).format("HH:mm")} />
            }
            body={
              <>
                {group.items.map((message) => {
                  return (
                    <Message key={message.id} content={message.text} isInsertedByClient={message.isInsertedByClient} />
                  );
                })}
              </>
            }
          />
        );
      }}
    </Observer>
  );
}

export function ChatFeedUI() {
  const chatLog = useContext(CtxChatLog);
  return (
    <Observer>
      {() => {
        return (
          <>
            {chatLog.processedMessages.map((item) => {
              switch (item.type) {
                case "message_group":
                  return <ChatFeedMessageGroup group={item} />;
                default:
                  return null;
              }
            })}
          </>
        );
      }}
    </Observer>
  );
}
