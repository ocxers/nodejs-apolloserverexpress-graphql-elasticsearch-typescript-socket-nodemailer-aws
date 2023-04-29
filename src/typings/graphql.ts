import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ActionDateBy = {
  __typename?: 'ActionDateBy';
  displayName?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['String']>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  errors?: Maybe<Array<Maybe<Error>>>;
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Created = {
  __typename?: 'Created';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<ActionDateBy>;
};

export type DropdownOptionType = {
  __typename?: 'DropdownOptionType';
  label?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Error = {
  __typename?: 'Error';
  message?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
};

export type InviteUsersResponse = {
  __typename?: 'InviteUsersResponse';
  reason?: Maybe<Reason>;
  status?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['String']>;
  activateAccount?: Maybe<Scalars['Boolean']>;
  addUser?: Maybe<Scalars['Boolean']>;
  changePassword?: Maybe<Scalars['Boolean']>;
  copyResetPasswordLink?: Maybe<Scalars['String']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  getEmailByActivateCode?: Maybe<Scalars['String']>;
  inviteUsers?: Maybe<Array<Maybe<InviteUsersResponse>>>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  sendResetPasswordLink?: Maybe<Scalars['Boolean']>;
  signIn?: Maybe<AuthResponse>;
  signOut?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
  updateUserOrder?: Maybe<Scalars['Boolean']>;
};


export type MutationActivateAccountArgs = {
  user?: Maybe<UserInput>;
};


export type MutationChangePasswordArgs = {
  email?: Maybe<Scalars['String']>;
  oldPassword?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};


export type MutationCopyResetPasswordLinkArgs = {
  email: Scalars['String'];
  host?: Maybe<Scalars['String']>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationGetEmailByActivateCodeArgs = {
  code: Scalars['String'];
};


export type MutationInviteUsersArgs = {
  users?: Maybe<Array<Maybe<UserInput>>>;
};


export type MutationResetPasswordArgs = {
  code?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};


export type MutationSendResetPasswordLinkArgs = {
  email?: Maybe<Scalars['String']>;
};


export type MutationSignInArgs = {
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  user?: Maybe<UserInput>;
};


export type MutationUpdateUserOrderArgs = {
  items?: Maybe<Array<Maybe<UserInput>>>;
};

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['String']>;
  getUserById?: Maybe<User>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  whoAmI?: Maybe<Scalars['String']>;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetUsersArgs = {
  organization?: Maybe<Array<Maybe<Scalars['String']>>>;
  role?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<Array<Maybe<Scalars['String']>>>;
  username?: Maybe<Scalars['String']>;
};

export type QueryFields = {
  from?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['String']>;
};

export type Reason = {
  __typename?: 'Reason';
  code?: Maybe<Scalars['Float']>;
  data?: Maybe<Scalars['String']>;
};

export type RolePermissionType = {
  __typename?: 'RolePermissionType';
  code?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type RoleType = {
  __typename?: 'RoleType';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Float']>;
  permissions?: Maybe<Array<Maybe<RolePermissionType>>>;
  role?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['String']>;
};

export type Timestamp = {
  __typename?: 'Timestamp';
  nanos?: Maybe<Scalars['Int']>;
  seconds?: Maybe<Scalars['Int']>;
};

export type Updated = {
  __typename?: 'Updated';
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<ActionDateBy>;
};

export type User = {
  __typename?: 'User';
  created?: Maybe<Created>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isCanary?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Float']>;
  password?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
  updated?: Maybe<Updated>;
  username?: Maybe<Scalars['String']>;
};

export type UserInput = {
  currentPassword?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isCanary?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  newPassword?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Float']>;
  password?: Maybe<Scalars['String']>;
  sendEmail?: Maybe<Scalars['Boolean']>;
  status?: Maybe<UserStatus>;
  username?: Maybe<Scalars['String']>;
};

export enum UserStatus {
  Active = 'Active',
  Disabled = 'Disabled',
  Pending = 'Pending'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ActionDateBy: ResolverTypeWrapper<Partial<ActionDateBy> | undefined>;
  AuthResponse: ResolverTypeWrapper<Partial<AuthResponse> | undefined>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']> | undefined>;
  Created: ResolverTypeWrapper<Partial<Created> | undefined>;
  DropdownOptionType: ResolverTypeWrapper<Partial<DropdownOptionType> | undefined>;
  Error: ResolverTypeWrapper<Partial<Error> | undefined>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']> | undefined>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']> | undefined>;
  InviteUsersResponse: ResolverTypeWrapper<Partial<InviteUsersResponse> | undefined>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  QueryFields: ResolverTypeWrapper<Partial<QueryFields> | undefined>;
  Reason: ResolverTypeWrapper<Partial<Reason> | undefined>;
  RolePermissionType: ResolverTypeWrapper<Partial<RolePermissionType> | undefined>;
  RoleType: ResolverTypeWrapper<Partial<RoleType> | undefined>;
  String: ResolverTypeWrapper<Partial<Scalars['String']> | undefined>;
  Subscription: ResolverTypeWrapper<{}>;
  Timestamp: ResolverTypeWrapper<Partial<Timestamp> | undefined>;
  Updated: ResolverTypeWrapper<Partial<Updated> | undefined>;
  User: ResolverTypeWrapper<Partial<User> | undefined>;
  UserInput: ResolverTypeWrapper<Partial<UserInput> | undefined>;
  UserStatus: ResolverTypeWrapper<Partial<UserStatus> | undefined>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ActionDateBy: Partial<ActionDateBy> | undefined;
  AuthResponse: Partial<AuthResponse> | undefined;
  Boolean: Partial<Scalars['Boolean']> | undefined;
  Created: Partial<Created> | undefined;
  DropdownOptionType: Partial<DropdownOptionType> | undefined;
  Error: Partial<Error> | undefined;
  Float: Partial<Scalars['Float']> | undefined;
  Int: Partial<Scalars['Int']> | undefined;
  InviteUsersResponse: Partial<InviteUsersResponse> | undefined;
  Mutation: {};
  Query: {};
  QueryFields: Partial<QueryFields> | undefined;
  Reason: Partial<Reason> | undefined;
  RolePermissionType: Partial<RolePermissionType> | undefined;
  RoleType: Partial<RoleType> | undefined;
  String: Partial<Scalars['String']> | undefined;
  Subscription: {};
  Timestamp: Partial<Timestamp> | undefined;
  Updated: Partial<Updated> | undefined;
  User: Partial<User> | undefined;
  UserInput: Partial<UserInput> | undefined;
}>;

export type AuthDirectiveArgs = { };

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ActionDateByResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionDateBy'] = ResolversParentTypes['ActionDateBy']> = ResolversObject<{
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Error']>>>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Created'] = ResolversParentTypes['Created']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['ActionDateBy']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DropdownOptionTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DropdownOptionType'] = ResolversParentTypes['DropdownOptionType']> = ResolversObject<{
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InviteUsersResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['InviteUsersResponse'] = ResolversParentTypes['InviteUsersResponse']> = ResolversObject<{
  reason?: Resolver<Maybe<ResolversTypes['Reason']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activateAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationActivateAccountArgs, never>>;
  addUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  changePassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, never>>;
  copyResetPasswordLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationCopyResetPasswordLinkArgs, 'email'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  getEmailByActivateCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationGetEmailByActivateCodeArgs, 'code'>>;
  inviteUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['InviteUsersResponse']>>>, ParentType, ContextType, RequireFields<MutationInviteUsersArgs, never>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, never>>;
  sendResetPasswordLink?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendResetPasswordLinkArgs, never>>;
  signIn?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType, RequireFields<MutationSignInArgs, never>>;
  signOut?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, never>>;
  updateUserOrder?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserOrderArgs, never>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
  getUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryGetUsersArgs, never>>;
  whoAmI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type ReasonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reason'] = ResolversParentTypes['Reason']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RolePermissionTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RolePermissionType'] = ResolversParentTypes['RolePermissionType']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RoleTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleType'] = ResolversParentTypes['RoleType']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<Maybe<ResolversTypes['RolePermissionType']>>>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  _?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_", ParentType, ContextType>;
}>;

export type TimestampResolvers<ContextType = any, ParentType extends ResolversParentTypes['Timestamp'] = ResolversParentTypes['Timestamp']> = ResolversObject<{
  nanos?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  seconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdatedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Updated'] = ResolversParentTypes['Updated']> = ResolversObject<{
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['ActionDateBy']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created?: Resolver<Maybe<ResolversTypes['Created']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isCanary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['UserStatus']>, ParentType, ContextType>;
  updated?: Resolver<Maybe<ResolversTypes['Updated']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  ActionDateBy?: ActionDateByResolvers<ContextType>;
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Created?: CreatedResolvers<ContextType>;
  DropdownOptionType?: DropdownOptionTypeResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  InviteUsersResponse?: InviteUsersResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reason?: ReasonResolvers<ContextType>;
  RolePermissionType?: RolePermissionTypeResolvers<ContextType>;
  RoleType?: RoleTypeResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Timestamp?: TimestampResolvers<ContextType>;
  Updated?: UpdatedResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
}>;
