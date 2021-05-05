/*
Copyright 2005 - 2021 Advantage Solutions, s. r. o.

This file is part of ORIGAM (http://www.origam.org).

ORIGAM is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ORIGAM is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ORIGAM. If not, see <http://www.gnu.org/licenses/>.
*/

import _ from "lodash";
import { action, computed, flow, observable } from "mobx";
import { Observer } from "mobx-react";
import React, { useContext, useEffect, useState } from "react";
import { AutoSizer, List } from "react-virtualized";
import { T } from "util/translation";
import { CtxAPI } from "../../componentIntegrations/Contexts";
import { getAvatarUrl } from "../../helpers/avatar";
import { ChatHTTPApi } from "../../services/ChatHTTPApi";
import { Button } from "../Buttons";
import { TagInput, TagInputItem, TagInputItemClose } from "../TagInput";
import {
  DefaultModal,
  ModalCloseButton,
  ModalFooter,
} from "../Windows/Windows";
import { IModalHandle } from "../Windows/WindowsSvc";

export interface IInteractor {
  choosenUsers?: UserToOutvite[];
  isCancel?: boolean;
}

class UserToOutvite {
  constructor(
    public id: string = "",
    public name: string = "",
    public avatarUrl: string = ""
  ) {}
}

class DialogState {
  constructor(public api: ChatHTTPApi) {}

  @observable rawUsers: UserToOutvite[] = [];
  @observable choosenUsers: UserToOutvite[] = [];
  @observable searchPhrase: string = "";

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

  @action.bound setItems(items: UserToOutvite[]) {
    this.rawUsers = items;
  }

  @action.bound
  handleSearchInputChange(event: any) {
    this.searchPhrase = event.target.value;
    this.loadUsersToChooseFrom();
  }

  _loadingPromise: any;

  loadUsersToChooseImm = () => {
    if (this._loadingPromise) {
      this._loadingPromise.cancel();
    }
    const _this = this;
    this._loadingPromise = flow(function* () {
      try {
        const usersToOutvite = yield* _this.api.getUsersToOutvite(
          _this.searchPhrase,
          100,
          0
        );
        _this.setItems(usersToOutvite.users);
      } finally {
        _this._loadingPromise = undefined;
      }
    })();
  };

  loadUsersToChooseFrom = _.throttle(this.loadUsersToChooseImm, 500);
}

export function OutviteUserDialog(props: {
  onCancel?: any;
  onSubmit?: (choosenUsers: UserToOutvite[]) => void;
}) {
  const api = useContext(CtxAPI);
  const [state] = useState(() => new DialogState(api));
  useEffect(() => {
    state.loadUsersToChooseImm();
  }, [state]);
  return (
    <DefaultModal
      footer={
        <ModalFooter align="center">
          <Button onClick={() => props.onSubmit?.(state.choosenUsers)}>
            {T("Ok", "Ok")}
          </Button>
          <Button onClick={props.onCancel}>{T("Cancel", "Cancel")}</Button>
        </ModalFooter>
      }
    >
      <ModalCloseButton onClick={props.onCancel} />
      <div className="chooseUserToInviteModalContent">
        <div className="chooseUserToInviteModalContent__header">
          <p>
            {T(
              "Select attendees to remove from this chatroom.",
              "select_users_to_remove_from_chatroom"
            )}
          </p>
          {/*<Observer>
            {() => (
              <input
                value={state.searchPhrase}
                onChange={state.handleSearchInputChange}
                className="searchUserInput"
                placeholder="Search a user to outvite"
              />
            )}
            </Observer>*/}
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

export function renderOutviteUserDialog() {
  return (modal: IModalHandle<IInteractor>) => {
    return (
      <OutviteUserDialog
        onCancel={() => modal.resolveInteract({ isCancel: true })}
        onSubmit={(choosenUsers) => modal.resolveInteract({ choosenUsers })}
      />
    );
  };
}
