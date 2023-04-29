import { ICreateUpdateDate } from './Interfaces'
import IUserType from './IUserType'

interface IUser extends ICreateUpdateDate {
  id: string
  username: string
  email: string
  password: IUserType
}

export default IUser
