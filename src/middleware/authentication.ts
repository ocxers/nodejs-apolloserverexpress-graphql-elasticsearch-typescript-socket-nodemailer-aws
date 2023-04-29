import * as jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'
import express, { NextFunction, Request, Response } from 'express'
import { NewRequest } from '@/interfaces/Interfaces'
import { ConfigType } from '@/typings/common'

const DEFAULT_ENV = 'development'

// Get current environment name.
let env = express().get('env') || DEFAULT_ENV

// Get configuration based on the environment.
let appConfig: ConfigType = require('@/config/' + (env || DEFAULT_ENV) + '.config').default

const { jwtSecret } = appConfig

/**
 * Ensure Authenticated
 */
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.header('Authorization')) {
    throw new AuthenticationError('You must be signed in.')
  } else {
    // @ts-ignore
    let token = req?.header('Authorization')?.split(' ')[1] ?? ''
    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
      if (err) {
        throw new AuthenticationError('Invalid Authorization!')
      } else {
        ;(req as NewRequest).user = decoded.user
        next?.()
      }
    })
  }
}

export default ensureAuthenticated
