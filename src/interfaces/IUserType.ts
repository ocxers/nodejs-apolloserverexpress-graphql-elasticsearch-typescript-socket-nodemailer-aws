import { ICreateUpdateDate } from './Interfaces'

interface IUserType extends ICreateUpdateDate {
  _id: string
  name: string
}

export default IUserType
