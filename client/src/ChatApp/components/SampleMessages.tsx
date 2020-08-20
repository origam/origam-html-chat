import React from "react";
import { MessageCluster, MessageClusterDirection } from "./MessageCluster";
import { MessageHeader } from "./MessageHeader";
import { Message } from "./Message";
import { Emoji } from "emoji-mart";

export function SampleMessages() {
  return (
    <>
      <MessageCluster
        avatar={<img alt=""  className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
        header={<MessageHeader personName="Jane" messageDateTime="20:19:54" />}
        body={<Message content={"Toe lot sap ten europeesch ongunstige verscholen plotseling!"} />}
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="21:12:11" />}
        body={
          <>
            <Message content={"Allen spijt ik hevea ad de bonte?"} />
            <Message
              content={
                "Als ter verdeeld mee gesticht interest verleden. Als weggevoerd ondernemer concurrent verdedigen heb nog beschaving. Chineesch oog wat wonderwel besluiten. Ad bedroegen op er arabieren kettingen nabijheid ijzererts. Door jaar na ad zake op over. Vaak als ziet dal vier. "
              }
            />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
        header={<MessageHeader personName="Jane" messageDateTime="21:19:00" />}
        body={
          <>
            <Message content={"Kedona leiden waarde breede meters op zouden in ik."} />
            <Message content={"Afwegen geplant gropeng..."} />
            <Message content={<>Gehouden veertien... !?</>} />
            <Message
              content={
                "Dik streng rijken steden bak een. Aan sunger met per weg lijnen lijden. Wonde eerst als wegen gif vindt lagen. Misschien dit prachtige nam verdiende was evenwicht. Het wat zoo europeanen opgebracht natuurlijk aanplanten uitgevoerd. Leelijk ze scholen in blijven ad. Kedona sap hoogte wouden per slotte heuvel openen. Na stam laag ik sago. Er is voet acre hout of zich. "
              }
            />
          </>
        }
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=1" />}
        header={<MessageHeader personName="Lilith" messageDateTime="23:14:19" />}
        body={
          <>
            <Message
              content={
                "Vloeit een sakais sedert ton wij alleen tonnen ook. Daar voor en lage ad iets vijf. Werk rook ipoh te zeer half kant in op."
              }
            />
            <Message
              content={
                <>
                  Ijzererts al <Emoji emoji={{ id: "innocent", skin: 3 } as any} size={22} /> chineezen de verkoopen!!!
                </>
              }
            />
          </>
        }
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="23:17:25" />}
        body={
          <>
            <Message content={"Graven oog :D :D :D"} />
            <Message
              content={
                "Er ontdaan en op enclave verdere te opening? De in brokken metalen bewerkt leelijk te. Daarna pompen noodig hij tin."
              }
            />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="23:18:01" />}
        body={
          <>
            <Message
              content={
                <>
                  Gewasschen en af is interesten! <Emoji emoji={{ id: "astonished", skin: 3 } as any} size={22} />
                </>
              }
            />{" "}
            <Message content={":-*"} />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
        header={<MessageHeader personName="Jane" messageDateTime="20:19:54" />}
        body={<Message content={"Toe lot sap ten europeesch ongunstige verscholen plotseling!"} />}
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="21:12:11" />}
        body={
          <>
            <Message content={"Allen spijt ik hevea ad de bonte?"} />
            <Message
              content={
                "Als ter verdeeld mee gesticht interest verleden. Als weggevoerd ondernemer concurrent verdedigen heb nog beschaving. Chineesch oog wat wonderwel besluiten. Ad bedroegen op er arabieren kettingen nabijheid ijzererts. Door jaar na ad zake op over. Vaak als ziet dal vier. "
              }
            />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
        header={<MessageHeader personName="Jane" messageDateTime="21:19:00" />}
        body={
          <>
            <Message content={"Kedona leiden waarde breede meters op zouden in ik."} />
            <Message content={"Afwegen geplant gropeng..."} />
            <Message content={<>Gehouden veertien... !?</>} />
            <Message
              content={
                "Dik streng rijken steden bak een. Aan sunger met per weg lijnen lijden. Wonde eerst als wegen gif vindt lagen. Misschien dit prachtige nam verdiende was evenwicht. Het wat zoo europeanen opgebracht natuurlijk aanplanten uitgevoerd. Leelijk ze scholen in blijven ad. Kedona sap hoogte wouden per slotte heuvel openen. Na stam laag ik sago. Er is voet acre hout of zich. "
              }
            />
          </>
        }
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=1" />}
        header={<MessageHeader personName="Lilith" messageDateTime="23:14:19" />}
        body={
          <>
            <Message
              content={
                "Vloeit een sakais sedert ton wij alleen tonnen ook. Daar voor en lage ad iets vijf. Werk rook ipoh te zeer half kant in op."
              }
            />
            <Message
              content={
                <>
                  Ijzererts al <Emoji emoji={{ id: "innocent", skin: 3 } as any} size={22} /> chineezen de verkoopen!!!
                </>
              }
            />
          </>
        }
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="23:17:25" />}
        body={
          <>
            <Message content={"Graven oog :D :D :D"} />
            <Message
              content={
                "Er ontdaan en op enclave verdere te opening? De in brokken metalen bewerkt leelijk te. Daarna pompen noodig hij tin."
              }
            />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="23:18:01" />}
        body={
          <>
            <Message
              content={
                <>
                  Gewasschen en af is interesten! <Emoji emoji={{ id: "astonished", skin: 3 } as any} size={22} />
                </>
              }
            />{" "}
            <Message content={":-*"} />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

<MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
        header={<MessageHeader personName="Jane" messageDateTime="20:19:54" />}
        body={<Message content={"Toe lot sap ten europeesch ongunstige verscholen plotseling!"} />}
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="21:12:11" />}
        body={
          <>
            <Message content={"Allen spijt ik hevea ad de bonte?"} />
            <Message
              content={
                "Als ter verdeeld mee gesticht interest verleden. Als weggevoerd ondernemer concurrent verdedigen heb nog beschaving. Chineesch oog wat wonderwel besluiten. Ad bedroegen op er arabieren kettingen nabijheid ijzererts. Door jaar na ad zake op over. Vaak als ziet dal vier. "
              }
            />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=21" />}
        header={<MessageHeader personName="Jane" messageDateTime="21:19:00" />}
        body={
          <>
            <Message content={"Kedona leiden waarde breede meters op zouden in ik."} />
            <Message content={"Afwegen geplant gropeng..."} />
            <Message content={<>Gehouden veertien... !?</>} />
            <Message
              content={
                "Dik streng rijken steden bak een. Aan sunger met per weg lijnen lijden. Wonde eerst als wegen gif vindt lagen. Misschien dit prachtige nam verdiende was evenwicht. Het wat zoo europeanen opgebracht natuurlijk aanplanten uitgevoerd. Leelijk ze scholen in blijven ad. Kedona sap hoogte wouden per slotte heuvel openen. Na stam laag ik sago. Er is voet acre hout of zich. "
              }
            />
          </>
        }
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=1" />}
        header={<MessageHeader personName="Lilith" messageDateTime="23:14:19" />}
        body={
          <>
            <Message
              content={
                "Vloeit een sakais sedert ton wij alleen tonnen ook. Daar voor en lage ad iets vijf. Werk rook ipoh te zeer half kant in op."
              }
            />
            <Message
              content={
                <>
                  Ijzererts al <Emoji emoji={{ id: "innocent", skin: 3 } as any} size={22} /> chineezen de verkoopen!!!
                </>
              }
            />
          </>
        }
        direction={MessageClusterDirection.Inbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="23:17:25" />}
        body={
          <>
            <Message content={"Graven oog :D :D :D"} />
            <Message
              content={
                "Er ontdaan en op enclave verdere te opening? De in brokken metalen bewerkt leelijk te. Daarna pompen noodig hij tin."
              }
            />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />

      <MessageCluster
        avatar={<img alt="" className="avatar__picture" src="https://i.pravatar.cc/35?img=29" />}
        header={<MessageHeader personName="Marika" messageDateTime="23:18:01" />}
        body={
          <>
            <Message
              content={
                <>
                  Gewasschen en af is interesten! <Emoji emoji={{ id: "astonished", skin: 3 } as any} size={22} />
                </>
              }
            />{" "}
            <Message content={":-*"} />
          </>
        }
        direction={MessageClusterDirection.Outbound}
      />
    </>
  );
}
