import express, { Response, NextFunction } from 'express'
import { NewRequest } from '@/interfaces/Interfaces'
import { ConfigType } from '@/typings/common'

const DEFAULT_ENV = 'development'

// Get current environment name.
let env = express().get('env') || DEFAULT_ENV

// Get configuration based on the environment.
let appConfig: ConfigType = require('@/config/' + (env || DEFAULT_ENV) + '.config').default

/*
 |--------------------------------------------------------------------------
 | Append config to Request Middleware
 |--------------------------------------------------------------------------
 */
function appendConfigToRequest(req: unknown, res: Response, next: NextFunction) {
  ;(req as unknown as NewRequest).config = appConfig
  next()
}

export default appendConfigToRequest
