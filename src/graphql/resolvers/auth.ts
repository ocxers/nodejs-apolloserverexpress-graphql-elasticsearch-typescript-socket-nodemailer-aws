import { find, omit } from 'lodash'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { Resolvers } from '@/typings/graphql'
import { signInValidator } from '@/validator/user'
import { NewRequest } from '@/interfaces/Interfaces'
import UserModel from '@/models/UserModel'
import EmailServices from '@/controllers/EmailServices'
import User from '@/typings/user'
import LoginRequiredController from '@/controllers/LoginRequiredController'

const checkIsValidPassword = (plainTextPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(plainTextPassword, hashedPassword)
}
const hashPassword = (plainTextPassword: string = '') => {
  return bcrypt.hashSync(plainTextPassword, 10)
}

const generateResetPasswordLink = (host: string = '', email: string = '', secret: string): string => {
  const payload = {
    email: email,
    iat: dayjs().unix(),
    exp: dayjs().add(2, 'hours').unix()
  }
  return `${host}/reset-password?code=${jwt.sign(
    payload,
    secret
  )}`
}

const auth: Resolvers = {
  Mutation: {
    signIn: async (_, args, { req }: { req: NewRequest }) => {
      const { email, password = '' } = args
      try {
        await signInValidator.validateAsync(omit(args, 'password'), { abortEarly: false })
      } catch (err: any) {
        return {
          errors: [
            {
              path: 'email',
              message: 'Email is invalid'
            }
          ]
        }
      }
      if (!password) {
        return {
          errors: [
            {
              path: 'password',
              message: 'Password is required'
            }
          ]
        }
      }
      try {
        const userRes = await UserModel.getByEmail(email)
        if (userRes.code === 400) {
          return {
            errors: [
              {
                path: 'unknown',
                message: userRes.message as any
              }
            ]
          }
        }
        const usersEs = userRes?.data
        const account = usersEs?.[0]
        if (!account) {
          return {
            errors: [{
              path: 'account',
              message: 'Account does not exist'
            }]
          }
        }
        if (!account?.password) {
          return {
            errors: [
              {
                path: 'password',
                message: 'Invalid password'
              }
            ]
          }
        }

        let isPasswordValid = checkIsValidPassword(password, account?.password)

        if (account && isPasswordValid) {
          req.user = account
          const payload = {
            user: account,
            iat: dayjs().unix(),
            exp: dayjs().add(14, 'days').unix()
          }

          await LoginRequiredController.delete(account.email)

          return {
            user: omit(account, 'password'),
            token: jwt.sign(payload, req.config.jwtSecret)
          }
        } else if (usersEs?.length >= 1) {
          return {
            errors: [
              {
                path: 'password',
                message: 'Invalid password'
              }
            ]
          }
        } else {
          return {
            errors: [
              {
                path: 'email',
                message: 'Invalid user name'
              }
            ]
          }
        }
      } catch (err) {
        return {
          errors: [
            {
              path: 'email',
              message: err as any
            }
          ]
        }
      }
    },
    inviteUsers: async (_, args, { req }: { req: NewRequest }) => {
      const users = args.users
      const promises: any = []
      users?.forEach((user) => {
        promises.push(
          new Promise((resolve, reject) => {
            const sendEmail = user.sendEmail
            const payload = {
              email: user.email,
              iat: dayjs().unix(),
              exp: dayjs().add(14, 'days').unix()
            }
            const inviteLink = sendEmail
              ? `${process.env.EMAIL_HOST || process.env.appHost}/activate-account?code=${jwt.sign(
                payload,
                req.config.jwtSecret
              )}`
              : ''
            if (user.id && user.id !== user.email) {
              // Update user
              try {
                UserModel.updateUser(req, {
                  ...user,
                  status: 'Pending',
                  isActive: false,
                  inviteLink
                }).then(async (err) => {
                  if (err?.code === 400) {
                    reject(err)
                  } else {
                    if (sendEmail) {
                      await EmailServices.sendInvitationMail({
                        message: `You have been invited to join __ocxers__.`,
                        inviteLink,
                        to: {
                          email: user.email
                        }
                      })
                    }
                    resolve(`Your invitation has been sent to "${user.email}" successfully.`)
                  }
                })
              } catch (err) {
                reject(err)
              }
            } else {
              try {
                // Add user
                UserModel.addUser(req, {
                  id: user.email, // will be updated when activate
                  email: user.email,
                  username: user.username || user.email?.split('@')[0],
                  status: 'Pending',
                  isActive: false,
                  inviteLink
                }).then(async (err) => {
                  if (err?.code === 400) {
                    reject(err)
                  } else {
                    if (sendEmail) {
                      await EmailServices.sendInvitationMail({
                        message: `You have been invited to join __ocxers__.`,
                        inviteLink,
                        to: {
                          email: user.email
                        }
                      })
                    }
                    resolve(`Your invitation has been sent to "${user.email}" successfully.`)
                  }
                })
              } catch (err) {
                reject(err)
              }
            }
          })
        )
      })

      return await Promise.allSettled(promises)
    },
    updateUser: async (_, args, { req }: { req: NewRequest }) => {
      const argUser = args.user
      if (argUser?.id) {
        const userId = argUser.id
        const { data: usersEs } = await UserModel.getById(argUser.id)
        const user = find(usersEs, (u) => u.id === userId)
        if (user) {
          if (argUser.currentPassword && argUser.newPassword) {
            if (
              !checkIsValidPassword(argUser.currentPassword, user.password) ||
              (!user.password && user.status === 'Pending')
            ) {
              throw new Error('Current password is incorrect.')
            }

            argUser.password = hashPassword(argUser.newPassword)
          }
        }

        const result = await UserModel.updateUser(req, args.user)
        if (result.code === 400) {
          throw new Error(result.data)
        }
        return true
      }
      return false
    },
    getEmailByActivateCode: async (_, args, { req }: { req: NewRequest }) => {
      const { code } = args
      let email = ''
      let errMsg = ''
      if (code) {
        jwt.verify(code, req.config.jwtSecret, (err: any, decoded: any) => {
          if (err) {
            errMsg = 'Invalid invitation link or invitation link expired.'
          } else {
            email = decoded.email
          }
        })
      }

      if (email) {
        const { data: usersEs } = await UserModel.getByEmail(email)
        const account = find(usersEs, (user) => user.email === email)
        if (!account.inviteLink) {
          errMsg = 'Invalid invitation link or invitation link expired.'
        }
      }

      if (errMsg) {
        throw new Error(errMsg)
      }
      return email
    },
    activateAccount: async (_, args, { req }: { req: NewRequest }) => {
      const { user = {} } = args
      if (!args.user?.password) {
        return false
      }
      const { data: usersEs } = await UserModel.getByEmail(user.email)
      const account = usersEs?.[0]

      const resp = await UserModel.activateUser(req, {
        _id: account._id || account.id,
        ...args.user,
        password: args.user?.password ? hashPassword(args.user?.password) : '',
        isActive: true,
        status: 'Active',
        inviteLink: ''
      })

      return !resp.code
    },
    sendResetPasswordLink: async (_, args, { req }: { req: NewRequest }) => {
      const email = args.email
      if (!email) {
        throw new Error('Invalid email.')
      }
      const resetPasswordLink = generateResetPasswordLink(process.env.EMAIL_HOST || process.env.appHost, email, req.config.jwtSecret)
      const { data: usersEs } = await UserModel.getByEmail(email)
      const user = usersEs?.[0]
      if (user) {
        await UserModel.updateUser(req, {
          ...user,
          status: 'Pending',
          isActive: false,
          resetPasswordLink
        })
        await EmailServices.sendResetPasswordMail({
          message: `Please follow the below link to reset your __ocxers__ account password.`,
          resetPasswordLink,
          to: {
            email
          }
        })

        return true
      } else {
        throw new Error('Invalid email or user does not exist in our system.')
      }
    },
    copyResetPasswordLink: async (_, args, { req }: { req: NewRequest }) => {
      const email = args.email
      const host = args.host || process.env.apiHost
      const resetPasswordLink = generateResetPasswordLink(host, email, req.config.jwtSecret)
      const { data: usersEs } = await UserModel.getByEmail(email)
      const user = usersEs?.[0]
      if (user) {
        await UserModel.updateUser(req, {
          ...user,
          status: 'Pending',
          isActive: false,
          resetPasswordLink
        })

        return resetPasswordLink
      } else {
        throw new Error('Invalid email')
      }
    },
    changePassword: async (_, args, { req }: { req: NewRequest }) => {
      const { email, oldPassword = '', password = '' } = args
      const user = req.user
      if (user.email !== email) {
        throw new Error('Wrong email address.')
      }

      if (email) {
        const { data: usersEs } = await UserModel.getByEmail(email)
        const user = find(usersEs, (user) => user.email === email)
        if (user) {
          if (!checkIsValidPassword(oldPassword, user.password)) {
            throw new Error('Old password is incorrect.')
          }

          await UserModel.updateUser(req, {
            ...user,
            password: hashPassword(password)
          })
          return true
        } else {
          return false
        }
      }
      return false
    },
    resetPassword: async (_, args, { req }: { req: NewRequest }) => {
      const { code, password = '' } = args
      let email = ''
      if (code) {
        jwt.verify(code, req.config.jwtSecret, (err: any, decoded: any) => {
          if (!err) {
            email = decoded.email
          }
        })
      }

      if (email) {
        const { data: usersEs } = await UserModel.getByEmail(email)
        const user = find(usersEs, (user) => user.email === email)
        if (user) {
          if (!user.resetPasswordLink) {
            throw new Error('Invalid reset password link or reset password link expired.')
          } else {
            await UserModel.updateUser(req, {
              ...user,
              resetPasswordLink: '',
              password: hashPassword(password)
            })
            return true
          }
        } else {
          return false
        }
      }
      return false
    },
    deleteUser: async (_, args) => {
      await UserModel.deleteUser(args.id)
      return true
    }
  },
  Query: {
    getUsers: async (_: any, args) => {
      const { data: usersEs } = await UserModel.getUsers(args)
      return usersEs?.map((user: User) => omit(user, 'password'))
    },
    getUserById: async (_: any, args) => {
      const { data: usersEs } = await UserModel.getById(args.id)
      const account = omit(usersEs?.[0], 'password') as unknown as User
      return account as any
    }
  }
}

export default auth
