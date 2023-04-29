import express from 'express'
import UserModel from '@/models/UserModel'
import { ConfigType } from '@/typings/common'

/**
 * Method: initialIndices
 *
 * Type: Function
 *
 * Parameters: None
 *
 * Description: This function initializes the user index by obtaining the current environment name, getting the app
 * configuration based on the environment and calling the `initUserIndex` function of the `UserModel` object to
 * initialize the user index with the obtained app configuration.
 *
 * Operations:
 * - Obtain current environment name using express().get('env') or use the default environment name.
 * - Get app configuration based on the environment name using require() function.
 * - Call initUserIndex method of UserModel object by passing the app configuration.
 *
 * Dependencies:
 * - express
 * - @/config/{env}.config.ts
 * - UserModel.initUserIndex
 */
const initialIndices = () => {
  const DEFAULT_ENV = 'development'

  // Get current environment name.
  const env = express().get('env') || DEFAULT_ENV

  // Get configuration based on the environment.
  // @ignore @typescript-eslint/no-var-requires
  const appConfig: ConfigType = require('@/config/' + (env || DEFAULT_ENV) + '.config').default

  UserModel.initUserIndex(appConfig)
}

export default initialIndices
