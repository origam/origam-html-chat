import React, { useContext } from "react";
import { Observer } from "mobx-react";
import { MessageCluster, MessageClusterDirection } from "../components/MessageCluster";
import { Message } from "../components/Message";
import { MessageHeader } from "../components/MessageHeader";
import moment from "moment";
import { CtxServices } from "../Contexts";
import { IMessageDirection, IMessageGroup } from "../ChatLog/ChatLog";

function feedDirection2messageDirection(dir: IMessageDirection) {
  if (dir === IMessageDirection.Inbound) return MessageClusterDirection.Inbound;
  return MessageClusterDirection.Outbound;
}

export function ChatFeedMessageGroup(props: { group: IMessageGroup }) {
  const { chatParticipants, chatroomSettings } = useContext(CtxServices);
  //const participant = { id: "id01", name: "Judith", avatarUrl: "https://i.pravatar.cc/35?img=25" };

  const participant = (function () {
    return chatParticipants.getById(props.group.sender);
  })();

  return (
    <Observer>
      {() => {
        const group = props.group;
        return (
          <MessageCluster
            key={group.$id}
            avatar={<img className="avatar__picture" src={`img/avatar-35/${participant?.avatarUrl}`} />}
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
  const { chatLog } = useContext(CtxServices);
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
