import { Request } from 'express'

interface NewRequest extends Request {
  user: any
  file: any
  config?: any
  esClient?: any
}

interface ICreated {
  createdBy?: {
    uid: string
    displayName: string
  }
  createdAt: string
}

interface IUpdated {
  updatedBy?: {
    uid: string
    displayName: string
  }
  updatedAt: string
}

interface ICreateUpdateDate {
  created?: ICreated
  updated?: IUpdated
}

export type { NewRequest, ICreated, IUpdated, ICreateUpdateDate }
