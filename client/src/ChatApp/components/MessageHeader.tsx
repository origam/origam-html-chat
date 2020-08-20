import React from "react";

export function MessageHeader(props: { personName: React.ReactNode; messageDateTime: React.ReactNode }) {
  return (
    <div className="header">
      <div className="header__personName">{props.personName}</div>
      <div className="header__messageDateTime">{props.messageDateTime}</div>
    </div>
  );
}