import _ from "lodash";
import { action, computed, flow, observable } from "mobx";
import { Observer } from "mobx-react";
import React, { useContext, useEffect, useState } from "react";
import { AutoSizer, List } from "react-virtualized";
import { CtxAPI } from "../../componentIntegrations/Contexts";
import { getAvatarUrl } from "../../helpers/avatar";
import { ChatHTTPApi } from "../../services/ChatHTTPApi";
import { Button } from "../Buttons";
import { TagInput, TagInputItem, TagInputItemClose } from "../TagInput";
import {
  DefaultModal,

  ModalCloseButton, ModalFooter
} from "../Windows/Windows";
import { IModalHandle } from "../Windows/WindowsSvc";

export interface IInteractor {
  choosenUsers?: UserToInvite[];
  isCancel?: boolean;
}

class UserToInvite {
  constructor(
    public id: string = "",
    public name: string = "",
    public avatarUrl: string = ""
  ) {}
}

class DialogState {
  constructor(public api: ChatHTTPApi) {
    console.log('Creating new dialog state.')
  }

  @observable rawUsers: UserToInvite[] = [];
  @observable choosenUsers: UserToInvite[] = [];
  @observable searchPhrase: string = "";
  @observable chatroomTopic: string = "";

  @computed get usersToChooseFrom() {
    return this.rawUsers.filter((user) => !this.choosenUserIds.has(user.id));
  }

  @computed get usersToChooseFromLength() {
    return this.usersToChooseFrom.length;
  }

  @computed get choosenUserIds() {
    return new Set(this.choosenUsers.map((user) => user.id));
  }

  @action.bound
  chooseUser(id: string) {
    this.choosenUsers.unshift(this.rawUsers.find((user) => user.id === id)!);
  }

  @action.bound unchooseUser(id: string) {
    const idx = this.choosenUsers.findIndex((user) => user.id === id);
    if (idx > -1) this.choosenUsers.splice(idx, 1);
  }

  @action.bound setItems(items: UserToInvite[]) {
    this.rawUsers = items;
  }

  @action.bound
  handleSearchInputChange(event: any) {
    this.searchPhrase = event.target.value;
    this.loadUsersToChooseFrom();
  }

  @action.bound
  handleChatroomTopicChange(event: any) {
    this.chatroomTopic = event.target.value;
  }

  _loadingPromise: any;

  loadUsersToChooseImm = () => {
    if (this._loadingPromise) {
      this._loadingPromise.cancel();
    }
    const _this = this;
    this._loadingPromise = flow(function* () {
      try {
        const usersToInvite = yield* _this.api.getUsersToInvite(
          _this.searchPhrase,
          100,
          0
        );
        _this.setItems(usersToInvite.users);
      } finally {
        _this._loadingPromise = undefined;
      }
    })();
  };

  loadUsersToChooseFrom = _.throttle(this.loadUsersToChooseImm, 500);
}

export function CreateChatroomDialog(props: {
  onCancel?: any;
  onSubmit?: (choosenUsers: UserToInvite[]) => void;
}) {
  const api = useContext(CtxAPI);
  const [state] = useState(() => new DialogState(api));
  useEffect(() => {
    /*const users: UserToInvite[] = [];
    for (let i = 1; i < 50; i++) {
      users.push(
        new UserToInvite(
          `uti${i}`,
          `User to invite ${i}`,
          `${String(i).padStart(3, "0")}.jpg`
        )
      );
    }
    state.setItems(users);*/
    state.loadUsersToChooseImm();
  }, [state]);
  return (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button onClick={() => props.onSubmit?.(state.choosenUsers)}>
            Ok
          </Button>
        </ModalFooter>
      }
    >
      <ModalCloseButton onClick={props.onCancel} />
      <div className="chooseUserToInviteModalContent">
        <div className="chooseUserToInviteModalContent__header">
          <p>Enter a topic for the new chatroom:</p>
          <Observer>
            {() => (
              <input
                value={state.chatroomTopic}
                onChange={state.handleChatroomTopicChange}
                className="chatroomTopicInput"
                placeholder="Set chatroom topic"
              />
            )}
          </Observer>
        </div>
        <div className="chooseUserToInviteModalContent__header">
          <p>Invite users to this chatroom</p>
          <Observer>
            {() => (
              <input
                value={state.searchPhrase}
                onChange={state.handleSearchInputChange}
                className="searchUserInput"
                placeholder="Search a user to invite"
              />
            )}
          </Observer>
        </div>
        <Observer>
          {() => (
            <TagInput>
              {state.choosenUsers.map((user) => (
                <TagInputItem
                  key={user.id}
                  body={user.name}
                  pin={
                    <TagInputItemClose
                      onClick={() => state.unchooseUser(user.id)}
                    />
                  }
                />
              ))}
            </TagInput>
          )}
        </Observer>
        <div className="chooseUserToInviteModalContent__body">
          <AutoSizer>
            {({ width, height }) => {
              return (
                <div className="userList" style={{ width, height }}>
                  <Observer>
                    {() => (
                      <List
                        height={height}
                        width={width}
                        rowCount={state.usersToChooseFromLength}
                        rowHeight={55}
                        rowRenderer={({ index, isScrolling, key, style }) => {
                          return (
                            <div
                              key={key}
                              style={style}
                              className="selectUserListItem"
                              onClick={() =>
                                state.chooseUser(
                                  state.usersToChooseFrom[index].id
                                )
                              }
                            >
                              <div className="selectUserListItem__avatar">
                                <div className="avatar">
                                  <div className="avatar__content">
                                    <img
                                      src={getAvatarUrl(
                                        state.usersToChooseFrom[index].avatarUrl
                                      )}
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="selectUserListItem__content">
                                {state.usersToChooseFrom[index].name}
                              </div>
                            </div>
                          );
                        }}
                      />
                    )}
                  </Observer>
                </div>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </DefaultModal>
  );
}

export function renderCreateChatroomDialog() {
  return (modal: IModalHandle<IInteractor>) => {
    return (
      <CreateChatroomDialog
        onCancel={() => modal.resolveInteract({ isCancel: true })}
        onSubmit={(choosenUsers) => modal.resolveInteract({ choosenUsers })}
      />
    );
  };
}
