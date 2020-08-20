class UserRepo {
  constructor({ dataEngine }) {
    this.dataEngine = dataEngine;
  }

  async getUsers() {
    return this.dataEngine.User.query();
  }

  async getUser(id) {
    return this.dataEngine.User.query().findById(id);
  }
}

module.exports = { UserRepo };
