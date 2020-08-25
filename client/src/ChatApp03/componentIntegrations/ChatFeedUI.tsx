import React, { useContext } from "react";
import { Observer } from "mobx-react";
import {
  MessageCluster,
  IMessageClusterDirection,
} from "../components/MessageCluster";
import { Message } from "../components/Message";
import { MessageHeader } from "../components/MessageHeader";
import moment from "moment";

export function ChatFeedUI() {
  return (
    <Observer>
      {() => {
        return (
          <>
            <MessageCluster
              key={""}
              avatar={<img className="avatar__picture" src={``} />}
              direction={IMessageClusterDirection.Outbound}
              header={
                <MessageHeader
                  personName={"TEST PARTICIPANT NAME"}
                  messageDateTime={moment().format("HH:mm")}
                />
              }
              body={
                <>
                  <Message
                    key={""}
                    content={"Message 1"}
                    isInsertedByClient={false}
                  />
                  <Message
                    key={""}
                    content={"Message 2"}
                    isInsertedByClient={false}
                  />
                  <Message
                    key={""}
                    content={"Message 3"}
                    isInsertedByClient={false}
                  />
                </>
              }
            />
            <MessageCluster
              key={""}
              avatar={<img className="avatar__picture" src={``} />}
              direction={IMessageClusterDirection.Inbound}
              header={
                <MessageHeader
                  personName={"TEST PARTICIPANT NAME"}
                  messageDateTime={moment().format("HH:mm")}
                />
              }
              body={
                <>
                  <Message
                    key={""}
                    content={"Message 1"}
                    isInsertedByClient={false}
                  />
                  <Message
                    key={""}
                    content={"Message 2"}
                    isInsertedByClient={false}
                  />
                  <Message
                    key={""}
                    content={"Message 3"}
                    isInsertedByClient={false}
                  />
                </>
              }
            />
          </>
        );
      }}
    </Observer>
  );
}
