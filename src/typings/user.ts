import { ICreateUpdateDate } from '@/typings/common'
import { UserStatus } from '@/typings/graphql'

interface User extends ICreateUpdateDate {
  id: string
  username?: string
  email: string
  password: string
  isActive?: boolean
  status?: UserStatus
  inviteLink?: string
}

export default User
