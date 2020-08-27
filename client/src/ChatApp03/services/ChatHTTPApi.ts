import axios from "axios";
import { Message } from "../model/Messages";
import { Chatroom } from "../model/Chatroom";
import { Participant, IParticipantStatus } from "../model/Participants";
import { LocalUser } from "../model/LocalUser";
import moment from "moment";

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
  constructor(public chatroomId = "") {}

  urlPrefix = "http://localhost:9099/api";

  testNum = 0;

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
        { userId: user.userId }
      );
    }
  }

  async getPolledData(
    afterIdIncluding?: string
  ): Promise<IGetPolledDataResult> {
    /*const timeSent = moment().toISOString();
    console.log(timeSent);
    const result: IGetPolledDataResult = {
      messages: [
        {
          id: "m01",
          authorId: "u22",
          authorAvatarUrl: this.testNum % 2 ? "058.jpg" : "059.jpg",
          authorName: `Author ${this.testNum}`,
          mentions: [],
          text: `Sample text ${this.testNum}`,
          timeSent,
        },
      ],
      info: {
        topic: `Channel topic ${this.testNum}`,
      },
      participants: [
        {
          id: "p01",
          name: `Participant ${this.testNum * 10}`,
          avatarUrl: this.testNum % 2 ? "021.jpg" : "024.jpg",
          status: this.testNum % 2 ? "online" : "away",
        },
        {
          id: "p02",
          name: `Participant ${this.testNum * 19}`,
          avatarUrl: this.testNum % 2 ? "020.jpg" : "015.jpg",
          status: this.testNum % 2 ? "online" : "away",
        },
        {
          id: "p03",
          name: `Participant ${this.testNum * 28}`,
          avatarUrl: this.testNum % 2 ? "001.jpg" : "005.jpg",
          status: this.testNum % 2 ? "offline" : "online",
        },
      ],
      localUser: {
        id: "u01",
        name: `Local user name ${this.testNum}`,
        avatarUrl: this.testNum % 2 ? `005.jpg` : `011.jpg`,
      },
    };

    this.testNum++;

    return result;*/

    const response = await axios.get(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/polledData`,
      { params: { afterIdIncluding } }
    );

    return response.data;
  }

  async sendMessage(arg: ISendMessageArg) {
    await axios.post(
      `${this.urlPrefix}/chatrooms/${this.chatroomId}/messages`,
      {
        ...arg,
      }
    );
  }
}
