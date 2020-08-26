const { Model } = require("objection");
const Knex = require("knex");
const uuid = require("uuid");

// Initialize knex.
const knex = Knex({
  client: "sqlite3",
  log: console,
  debug: true,
  useNullAsDefault: true,
  connection: {
    filename: "data.sqlite",
  },
});

// Give the knex instance to objection.
Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      chatrooms: {
        relation: Model.ManyToManyRelation,
        modelClass: Chatroom,
        join: {
          from: "users.id",
          through: {
            from: "users_chatroom.userId",
            to: "users_chatroom.chatroomId",
            extra: ["isInvited", "isOnline", "lastSeen"],
          },
          to: "chatrooms.id",
        },
      },
    };
  }
}

class Chatroom extends Model {
  static get tableName() {
    return "chatrooms";
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "chatrooms.id",
          through: {
            from: "users_chatroom.chatroomId",
            to: "users_chatroom.userId",
            extra: ["isInvited", "isOnline", "lastSeen"],
          },
          to: "users.id",
        },
      },
      messages: {
        relation: Model.HasManyRelation,
        join: {
          from: "chatrooms.id",
          to: "messages.chatroomId",
        },
      },
    };
  }
}

class Message extends Model {
  static get tableName() {
    return "messages";
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "messages.authorId",
          to: "users.id",
        },
      },
      chatroom: {
        relation: Model.BelongsToOneRelation,
        modelClass: Chatroom,
        join: {
          from: "messages.chatroomId",
          to: "chatrooms.id",
        },
      },
    };
  }
}

async function createSchema() {
  await knex.schema.dropTableIfExists("users_chatroom");
  //await knex.schema.dropTableIfExists("users_messages");
  //await knex.schema.dropTableIfExists("chatroom_messages");

  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("chatrooms");
  await knex.schema.dropTableIfExists("messages");

  await knex.schema.createTable("users", (t) => {
    t.specificType("id", "UUID").primary();
    t.string("name");
    t.string("avatarUrl");
  });

  await knex.schema.createTable("chatrooms", (t) => {
    t.specificType("id", "UUID").primary();
    t.string("name");
  });

  await knex.schema.createTable("messages", (t) => {
    t.specificType("id", "UUID").primary();
    t.specificType("authorId", "UUID");
    t.specificType("chatroomId", "UUID");
    t.dateTime("timeSent");
    t.string("text");

    t.foreign("authorId").references("users.id");
    t.foreign("chatroomId").references("chatrooms.id");
  });

  await knex.schema.createTable("users_chatroom", (t) => {
    t.specificType("userId", "UUID");
    t.specificType("chatroomId", "UUID");
    t.boolean("isInvited").defaultTo(false);
    t.boolean("isOnline").defaultTo(false);
    t.dateTime("lastSeen");

    t.primary(["userId", "chatroomId"]);
    t.foreign("userId").references("id").inTable("users");
    t.foreign("chatroomId").references("id").inTable("chatrooms");
  });
}

async function fillInitialData() {
  const users = [
    await User.query().insertAndFetch({ name: "TomaskoPavel", avatarUrl: "001.jpg", id: uuid.v4() }),
    await User.query().insertAndFetch({ name: "RedKathy", avatarUrl: "002.jpg", id: uuid.v4() }),
    await User.query().insertAndFetch({ name: "WallaceElena", avatarUrl: "003.jpg", id: uuid.v4() }),
    await User.query().insertAndFetch({ name: "SmithDon", avatarUrl: "004.jpg", id: uuid.v4() }),
    await User.query().insertAndFetch({ name: "TheDevil", avatarUrl: "005.jpg", id: uuid.v4() }),
  ];

  const chatrooms = [
    await Chatroom.query().insertAndFetch({ name: "General", id: uuid.v4() }),
    await Chatroom.query().insertAndFetch({ name: "Gossip", id: uuid.v4() }),
    await Chatroom.query().insertAndFetch({ name: "Future features", id: uuid.v4() }),
    await Chatroom.query().insertAndFetch({ name: "Bugs", id: uuid.v4() }),
    await Chatroom.query().insertAndFetch({ name: "Hot chicks", id: uuid.v4() }),
  ];

  await chatrooms[0].$relatedQuery("users").relate({ id: users[0].id, isInvited: true });
  await chatrooms[0].$relatedQuery("users").relate({ id: users[1].id, isInvited: true });
  await chatrooms[0].$relatedQuery("users").relate({ id: users[2].id, isInvited: true });

  await chatrooms[1].$relatedQuery("users").relate({ id: users[0].id, isInvited: true });
  await chatrooms[1].$relatedQuery("users").relate({ id: users[1].id, isInvited: true });
  await chatrooms[1].$relatedQuery("users").relate({ id: users[2].id, isInvited: true });
  await chatrooms[1].$relatedQuery("users").relate({ id: users[3].id, isInvited: true });

  await chatrooms[2].$relatedQuery("users").relate({ id: users[2].id, isInvited: true });
  await chatrooms[2].$relatedQuery("users").relate({ id: users[3].id, isInvited: true });
  await chatrooms[2].$relatedQuery("users").relate({ id: users[4].id, isInvited: true });

  const check = await chatrooms[0].$loadRelated("users");
  console.log(JSON.stringify(check, null, 2));
}

async function start() {
  await createSchema();
  await fillInitialData();
  return {
    User,
    Chatroom,
    Message,
  };
}

module.exports = { start };
