//import axios from "axios";
import { config } from "../config";
import axiosLib from "axios";

export interface IGetPolledDataResult {
  messages: {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    timeSent: string;
    text: string;
    mentions: {
      id: string;
      name: string;
      avatarUrl: string;
    }[];
  }[];
  info: {
    topic: string;
  };
  participants: {
    id: string;
    name: string;
    avatarUrl: string;
    status: "online" | "away" | "offline" | "none";
  }[];
  localUser: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}

export interface IGetUsersToInviteResult {
  users: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
}

export interface IInviteUsersArg {
  users: { userId: string }[];
}

export interface ISendMessageArg {
  id: string;
  text: string;
  mentions: {
    id: string;
  }[];
}

export class ChatHTTPApi {
  constructor(public chatroomId = "", public fakeUserId?: string) {}

  axios = axiosLib.create({});

  urlPrefix = config.apiUrlPrefix;

  testNum = 0;

  get authToken() {
    return sessionStorage.getItem('origamAuthToken') || config.authToken;
  }

  get headers() {
    let result: { [key: string]: any } = {};

    if (this.fakeUserId) {
      result = { ...result, "x-fake-user-id": this.fakeUserId };
    }

    if (this.authToken) {
      result = { ...result, Authorization: `Bearer ${this.authToken}` };
    }

    return result;
  }

  setChatroomId(chatroomId: string) {
    this.chatroomId = chatroomId;
  }

  *getUsersToInvite(
    searchPhrase: string,
    limit: number,
    offset: number
  ): Generator<any, IGetUsersToInviteResult> {
    const cancelSource = axiosLib.CancelToken.source();
    try {
      const response = yield this.axios.get(
        `${this.urlPrefix}/chatrooms/${this.chatroomId}/usersToInvite`,
        {
          params: { searchPhrase, limit, offset },
          headers: this.headers,
          cancelToken: cancelSource.token,
        }
      );
      return {
        users: (response as any).data,
      };
    } finally {
      cancelSource.cancel();
    }
  }

  *getUsersToInviteByReferences(
    searchPhrase: string,
    limit: number,
    offset: number,
    references: { [key: string]: any }
  ): Generator<any, IGetUsersToInviteResult> {
    const cancelSource = axiosLib.CancelToken.source();
    try {
      const response = yield this.axios.get(
        `${this.urlPrefix}/users/listToInvite`,
        {
          params: { searchPhrase, limit, offset, ...references },
          headers: this.headers,
          cancelToken: cancelSource.token,
        }
      );
      return {
        users: (response as any).data,
      };
    } finally {
      cancelSource.cancel();
    }
  }

  *getUsersToOutvite(
    searchPhrase: string,
    limit: number,
    offset: number
  ): Generator<any, IGetUsersToInviteResult> {
    const cancelSource = axiosLib.CancelToken.source();
    try {
      const response = yield this.axios.get(
        `${this.urlPrefix}/chatrooms/${this.chatroomId}/usersToOutvite`,
        {
          params: { searchPhrase, limit, offset },
          headers: this.headers,
          cancelToken: cancelSource.token,
        }
      );
      return {
        users: (response as any).data,
      };
    } finally {
      cancelSource.cancel();
    }
  }

  *getUsersToMention(
    searchPhrase: string,
    limit: number,
    offset: number
  ): Generator<any, IGetUsersToInviteResult> {
    const cancelSource = axiosLib.CancelToken.source();
    try {
      const response = yield this.axios.get(
        `${this.urlPrefix}/chatrooms/${this.chatroomId}/usersToMention`,
        {
          params: { searchPhrase, limit, offset },
          headers: this.headers,
          cancelToken: cancelSource.token,
        }
      );
      return {
        users: (response as any).data,
      };
    } finally {
      cancelSource.cancel();
    }
  }

  async createChatroom(
    references: { [key: string]: any },
    topic: string,
    inviteUsers: string[]
  ): Promise<{ chatroomId: any }> {
    const response = await this.axios.post(
      `${this.urlPrefix}/chatrooms/create`,
      {
        topic,
        references,
        inviteUsers: inviteUsers.map((userId) => ({ id: userId })),
      },
      { headers: this.headers }
    );
    return { chatroomId: response.data };
  }

  async inviteUsers(arg: IInviteUsersArg) {
    for (let user of arg.users) {
      await this.axios.post(
        `${this.urlPrefix}/chatrooms/${this.chatroomId}/inviteUser`,
        { userId: user.userId },
        { headers: this.headers }
      );
    }
  }

  async outviteUsers(arg: IInviteUsersArg) {
    for (let user of arg.users) {
      await this.axios.post(
        `${this.urlPrefix}/chatrooms/${this.chatroomId}/outviteUser`,
        { userId: user.userId },
        { headers: this.headers }
      );
    }
  }

  async getPolledData(
    afterIdIncluding?: string
  ): Promise<IGetPolledDataResult> {
    const response = await this.axios.get(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/polledData`,
      { params: { afterIdIncluding }, headers: this.headers }
    );

    return response.data;
  }

  async sendMessage(arg: ISendMessageArg) {
    await this.axios.post(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/messages`,
      {
        ...arg,
      },
      { headers: this.headers }
    );
  }

  async abandonChatroom() {
    await this.axios.post(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/abandon`,
      {},
      { headers: this.headers }
    );
  }

  async patchChatroomInfo(topic: string) {
    await this.axios.post(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/info`,
      { topic },
      { headers: this.headers }
    );
  }
}
