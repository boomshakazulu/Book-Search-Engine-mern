const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const user = isAuthenticated(context);
      if (!user) {
        throw AuthenticationError;
      }
      return User.findOne({ _id: user._id });
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      const user = signToken(context);
      if (!user) {
        throw new AuthenticationError("User not authenticated");
      }

      try {
        // Find the user by ID
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $push: { savedBooks: book } },
          { new: true }
        );

        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error("Error saving the book");
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      const user = signToken(context);
      if (!user) {
        throw new AuthenticationError("User not authenticated");
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(user.id, {
          $pull: { savedBooks: bookId },
        });
        return updatedUser;
      } catch (err) {
        throw new Error("Error removing book");
      }
    },
  },
};

module.exports = resolvers;
