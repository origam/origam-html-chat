class ChatroomRepo {
  constructor({ dataEngine }) {
    this.dataEngine = dataEngine;
  }

  async getChatrooms() {
    return this.dataEngine.Chatroom.query();
  }
}

module.exports = { ChatroomRepo };
