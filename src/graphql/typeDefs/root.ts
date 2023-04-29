import { gql } from 'apollo-server-express'

export default gql`
  directive @auth on FIELD_DEFINITION

  input QueryFields {
    from: Int
    limit: Int
    sort: String
  }

  type Timestamp {
    seconds: Int
    nanos: Int
  }

  type Query {
    _: String
    whoAmI: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`
