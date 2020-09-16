import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState, useEffect } from "react";
import cx from "classnames";

export function MessageBarRaw(
  props: {
    messages: React.ReactNode;
    onUserScrolledToTail?(isTailed: boolean): void;
    isTrackingLatestMessages?: boolean;
  },
  ref: any
) {
  const [isScrollToEnd, setIsScrollToEnd] = useState(false);

  let isUserScroll = true;
  let hIsUserScrollTimeout: any;

  useImperativeHandle(ref, () => ({
    scrollToEnd() {
      scrollToEnd();
    },
  }));

  const refContentContainer = useRef<HTMLDivElement>(null);

  function scrollToEnd() {
    if (refContentContainer.current) {
      //console.log(refContentContainer.current!.scrollHeight, refContentContainer.current!.clientHeight);
      const elm = refContentContainer.current!;
      elm.scrollTop = elm.scrollHeight - elm.clientHeight;
      isUserScroll = false;
      clearTimeout(hIsUserScrollTimeout);
      hIsUserScrollTimeout = setTimeout(() => (isUserScroll = true), 200);
    }
  }

  const handleScrollToEndClick = useMemo(
    () => () => {
      scrollToEnd();
      props.onUserScrolledToTail?.(true);
    },
    []
  );

  const checkScrollToEnd = useMemo(
    () => () => {
      if (refContentContainer.current) {
        const elm = refContentContainer.current!;
        //console.log(elm.scrollHeight - elm.clientHeight - elm.scrollTop);
        if (elm.scrollHeight - elm.clientHeight - elm.scrollTop > 10) {
          //console.log(props.isTrackingLatestMessages);
          if (props.isTrackingLatestMessages) {
            scrollToEnd();
          } else {
            if (!isScrollToEnd && isUserScroll) setIsScrollToEnd(true);
          }
        } else {
          if (isScrollToEnd && isUserScroll) setIsScrollToEnd(false);
        }
      }
    },
    [props.isTrackingLatestMessages]
  );

  useEffect(() => {
    const hTimer = setInterval(() => {
      checkScrollToEnd();
    }, 100);
    return () => clearInterval(hTimer);
  }, [props.isTrackingLatestMessages]);

  const handleMessageBarScroll = useMemo(
    () => (event: any) => {
      if (refContentContainer.current) {
        const elm = refContentContainer.current!;
        if (elm.scrollHeight - elm.clientHeight - elm.scrollTop > 10) {
          setIsScrollToEnd(true);
          if (isUserScroll) props.onUserScrolledToTail?.(false);
        } else {
          setIsScrollToEnd(false);
          if (isUserScroll) props.onUserScrolledToTail?.(true);
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
          <i className="fas fa-arrow-down" />
        </button>
      </div>
    </div>
  );
}

export const MessageBar = forwardRef(MessageBarRaw);
