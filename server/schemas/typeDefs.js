const typeDefs = `
type User{
    username: String
    email: String
    password: String
    savedBooks:[Book]!
    _id: ID
}
type Book{
    bookId: ID
    authors: [String]
    description" String
    title: String
    image: String
    link: String
}
type Auth {
    token: ID!
    user: User
  }

type Query {
    me: User
}

input bookInput {
    authors: [String]!
    description: String!
    title: String!
    bookId: ID!
    image: String!
    link: String!
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: bookInput!):User
    removeBook(bookId:String!):User
}
`;
module.exports = typeDefs;
