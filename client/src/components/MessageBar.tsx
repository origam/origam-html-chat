import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import cx from "classnames";

export function MessageBarRaw(props: { messages: React.ReactNode }, ref: any) {
  const [isScrollToEnd, setIsScrollToEnd] = useState(false);

  useImperativeHandle(ref, () => ({
    scrollToEnd() {
      scrollToEnd();
    },
  }));

  const refContentContainer = useRef<HTMLDivElement>(null);

  function scrollToEnd() {
    if (refContentContainer.current) {
      console.log(refContentContainer.current!.scrollHeight, refContentContainer.current!.clientHeight);
      const elm = refContentContainer.current!;
      elm.scrollTop = elm.scrollHeight - elm.clientHeight;
    }
  }

  const handleScrollToEndClick = useMemo(
    () => () => {
      scrollToEnd();
    },
    []
  );

  const handleMessageBarScroll = useMemo(
    () => (event: any) => {
      if (refContentContainer.current) {
        const elm = refContentContainer.current!;
        console.log(elm.scrollHeight - elm.clientHeight - elm.scrollTop);
        if (elm.scrollHeight - elm.clientHeight - elm.scrollTop > 30) {
          setIsScrollToEnd(true);
        } else {
          setIsScrollToEnd(false);
        }
      }
    },
    []
  );

  return (
    <div className="messageBarContainer">
      <div className="messageBar" ref={refContentContainer} onScroll={handleMessageBarScroll}>
        {props.messages}
      </div>
      <div
        className={cx("messageBarContainer__scrollToEndControl", {
          "messageBarContainer__scrollToEndControl--isHidden": !isScrollToEnd,
        })}
      >
        <button className="scrollToEndButton" onClick={handleScrollToEndClick}>
          Go to end
        </button>
      </div>
    </div>
  );
}

export const MessageBar = forwardRef(MessageBarRaw);
