import { ICreateUpdateDate } from '@/typings/common'

interface IUserType extends ICreateUpdateDate {
  _id: string
  name: string
}

export default IUserType
