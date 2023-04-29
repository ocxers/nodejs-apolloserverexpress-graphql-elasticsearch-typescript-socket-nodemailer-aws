import { Request } from 'express'

export interface NewRequest extends Request {
  user: any
  file: any
  config?: any
  esClient?: any
}

export interface ICreated {
  createdBy?: {
    uid?: string
    displayName: string
  }
  createdAt: string | number
}

export interface IUpdated {
  updatedBy?: {
    uid?: string
    displayName: string
  }
  updatedAt: string | number
}

export interface ICreateUpdateDate {
  created?: ICreated
  updated?: IUpdated
}

export interface ConfigType {
  jwtSecret: string
  esUrl: string
}

export interface FromToSchema {
  id?: string
  email: string
  displayName?: string
  avatar?: string
}
