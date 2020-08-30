import axios from "axios";
import { config } from "../config";


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

  urlPrefix = config.apiUrlPrefix;

  testNum = 0;

  get headers() {
    if (this.fakeUserId) return { "x-fake-user-id": this.fakeUserId };
  }

  *getUsersToInvite(
    searchPhrase: string,
    limit: number,
    offset: number
  ): Generator<any, IGetUsersToInviteResult> {
    const cancelSource = axios.CancelToken.source();
    try {
      const response = yield axios.get(
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

  *getUsersToMention(
    searchPhrase: string,
    limit: number,
    offset: number
  ): Generator<any, IGetUsersToInviteResult> {
    const cancelSource = axios.CancelToken.source();
    try {
      const response = yield axios.get(
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



  async inviteUsers(arg: IInviteUsersArg) {
    for (let user of arg.users) {
      await axios.post(
        `${this.urlPrefix}/chatrooms/${this.chatroomId}/inviteUser`,
        { userId: user.userId },
        { headers: this.headers }
      );
    }
  }

  async getPolledData(
    afterIdIncluding?: string
  ): Promise<IGetPolledDataResult> {
    const response = await axios.get(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/polledData`,
      { params: { afterIdIncluding }, headers: this.headers }
    );

    return response.data;
  }

  async sendMessage(arg: ISendMessageArg) {
    await axios.post(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/messages`,
      {
        ...arg,
      },
      { headers: this.headers }
    );
  }

  async abandonChatroom() {
    await axios.post(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/abandon`,
      {},
      { headers: this.headers }
    );
  }
}
