import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      email
      username
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;
