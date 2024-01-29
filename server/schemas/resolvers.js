const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    //search for yourseld (to find your saved books)
    me: async (parent, args, context) => {
      if (context.user) {
        const data = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return data;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    //adds a user to the DB
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    //login resolver
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError(
          "User not found, Do you need to create an account?"
        );
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect username or password");
      }
      const token = signToken(user);
      return { token, user };
    },
    //saves a book to your account
    saveBook: async (parent, { book }, context) => {
      //checks if user is logged in
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      //if not logged in throws authentication error
      throw new AuthenticationError("You need to be logged in!");
    },
    //removes a saved book
    removeBook: async (parent, { bookId }, context) => {
      //checks if user is logged in
      if (context.user) {
        //if not logged in throws authentication error
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Login required!");
    },
  },
};

module.exports = resolvers;
