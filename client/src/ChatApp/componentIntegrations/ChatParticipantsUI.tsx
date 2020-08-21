import React, { useContext } from "react";
import { SidebarRow } from "../components/SidebarRow";
import { Observer } from "mobx-react";
import { ChatParticipant } from "../components/ChatParticipant";
import { CtxServices } from "../Contexts";


export function ChatParticipantsUI() {
  /*const chatParticipants = {
    items: [
      { id: "id01", name: "Judith", avatarUrl: "https://i.pravatar.cc/35?img=25" },
      { id: "id02", name: "Ivana", avatarUrl: "https://i.pravatar.cc/35?img=27" },
    ],
  };*/
  const {chatParticipants} = useContext(CtxServices);
  return (
    <Observer>
      {() => (
        <>
          {chatParticipants.items.map((item) => (
            <SidebarRow key={item.id}>
              <ChatParticipant
                avatar={<img alt="" className="avatar__picture" src={item.avatarUrl} />}
                content={<>{item.name}</>}
                status={item.status}
              />
            </SidebarRow>
          ))}
        </>
      )}
    </Observer>
  );
}
