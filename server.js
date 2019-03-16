const { graphql, buildSchema } = require("graphql");

const db = {
  users: [
    {
      id: 1,
      email: "user1@gmail.com",
      name: "User1"
    },
    {
      id: 2,
      email: "user2@gmail.com",
      name: "User2"
    }
  ]
};

const Schema = buildSchema(`
    type  Query {
        users: [User!]!
    }
    type User{
        id: ID!
        email: String!
        avatarUrl: String
        name: String
    }
`);

const rootValue = {
  users: () => db.users
};

graphql(
  Schema,
  `
    {
      users {
        id
        email
        name
      }
    }
  `,
  rootValue
)
  .then(res => console.dir(res, { depth: null }))
  .catch(console.error);
