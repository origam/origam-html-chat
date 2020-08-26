import React from "react";
import {
  DefaultModal,
  ModalFooter,
  ModalCloseButton,
} from "../Windows/Windows";
import { Button } from "../Buttons";
import { IModalHandle } from "../Windows/WindowsSvc";
import { AutoSizer, List } from "react-virtualized";

export interface IInteractor {
  userClicked?: number;
  isCancel?: boolean;
}

export function renderInviteUserDialog() {
  return (modal: IModalHandle<IInteractor>) => {
    return (
      <DefaultModal
        footer={
          null
        }
      >
        <ModalCloseButton onClick={() => modal.resolveInteract({isCancel: true})} />
        <div className="chooseUserToInviteModalContent">
          <div className="chooseUserToInviteModalContent__header">
            <p>Invite a user to this chatroom</p>
            <input
              className="searchUserInput"
              placeholder="Search a user to invite"
            />
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
                          <div
                            key={key}
                            style={style}
                            className="selectUserListItem"
                            onClick={() => modal.resolveInteract({userClicked: index})}
                          >
                            <div className="selectUserListItem__avatar">
                              <div className="avatar">
                                <div className="avatar__content">
                                  <img
                                    src={`https://i.pravatar.cc/35?img=${index}`}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="selectUserListItem__content">
                              User {index}
                            </div>
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
      </DefaultModal>
    );
  };
}
