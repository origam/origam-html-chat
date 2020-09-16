import React from "react";
import { AutoSizer, List } from "react-virtualized";

export function InviteUserModal(props: { onCloseClick?: any }) {
  return (
    <div className="appOverlay">
      <div className="appModal">
        <div className="appModal__close" onClick={props.onCloseClick}>
          <i className="fas fa-times" />
        </div>
        <div className="chooseUserToInviteModalContent">
          <div className="chooseUserToInviteModalContent__header">
            <input className="searchUserInput" placeholder="Search a user to invite" />
          </div>
          <div className="chooseUserToInviteModalContent__body">
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <div className="userList" style={{ width, height }}>
                    <List
                      height={height}
                      width={width}
                      rowCount={100}
                      rowHeight={55}
                      rowRenderer={({ index, isScrolling, key, style }) => {
                        return (
                          <div key={key} style={style} className="selectUserListItem">
                            <div className="selectUserListItem__avatar">
                              <div className="avatar">
                                <div className="avatar__content">
                                  <img src={`https://i.pravatar.cc/35?img=${index}`} alt="" />
                                </div>
                              </div>
                            </div>
                            <div className="selectUserListItem__content">User {index}</div>
                          </div>
                        );
                      }}
                    />
                  </div>
                );
              }}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
}
