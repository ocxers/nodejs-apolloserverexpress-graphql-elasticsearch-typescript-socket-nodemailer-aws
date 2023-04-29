import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    signIn(email: String, password: String): AuthResponse
    changePassword(email: String, oldPassword: String, password: String): Boolean @auth
    addUser: Boolean @auth
    signOut: Boolean
    updateUser(user: UserInput): Boolean @auth
    updateUserOrder(items: [UserInput]): Boolean @auth
    inviteUsers(users: [UserInput]): [InviteUsersResponse] @auth
    activateAccount(user: UserInput): Boolean
    getEmailByActivateCode(code: String!): String
    sendResetPasswordLink(email: String): Boolean
    copyResetPasswordLink(email: String!, host: String): String
    resetPassword(code: String, password: String): Boolean
    deleteUser(id: String!): Boolean
  }

  extend type Query {
    getUsers(username: String, organization: [String], role: [String], status: [String]): [User] @auth
    getUserById(id: String!): User @auth
  }
  
  type ActionDateBy {
    uid: String
    displayName: String
  }

  type Created {
    createdBy: ActionDateBy
    createdAt: String
  }
  type Updated {
    updatedBy: ActionDateBy
    updatedAt: String
  }
  
  enum UserStatus {
    Active
    Pending
    Disabled
  }

  input UserInput {
    firstName: String
    lastName: String
    username: String
    id: String
    email: String
    password: String
    isActive: Boolean
    sendEmail: Boolean
    order: Float
    isCanary: Boolean
    status: UserStatus
    newPassword: String
    currentPassword: String
  }

  type RolePermissionType {
    id: String
    name: String
    code: String
    value: Int
  }

  type RoleType {
    id: String
    name: String
    role: String
    value: Int
    permissions: [RolePermissionType]
    order: Float
  }

  type DropdownOptionType {
    label: String
    value: String
  }

  type User {
    firstName: String
    lastName: String
    username: String
    id: String
    email: String
    password: String
    status: UserStatus
    order: Float
    isActive: Boolean
    isCanary: Boolean
    created: Created
    updated: Updated
  }

  type Error {
    path: String
    message: String
  }

  type AuthResponse {
    token: String
    user: User
    errors: [Error]
  }

  type Reason {
    code: Float
    data: String
  }

  type InviteUsersResponse {
    status: String
    value: String
    reason: Reason
  }
`
