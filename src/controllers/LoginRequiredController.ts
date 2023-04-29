import { NewRequest } from '@/interfaces/Interfaces'
import LoginRequiredModel from '@/models/LoginRequiredModel'
import UserModel from '@/models/UserModel'
import User from '@/typings/user'
import SocketIOServices from '@/socket/socket'

class LoginRequiredController {
  /**
   * Method: add
   *
   * Type: Static Method
   *
   * Parameters:
   * - email (string): The email address of a user.
   * - type (string) (optional, default: "USER_ROLE_CHANGED"): Specifies the type of event that has taken place.
   *
   * Description:
   * The `add` method is a static method that performs two asynchronous operations. It takes in two parameters, an
   * email address and an optional type of event. If the type is not provided, it defaults to "USER_ROLE_CHANGED".
   *
   * Operations:
   * 1. Calls the `bulkAdd` method from the `LoginRequiredModel` class, passing the email address and type as
   * arguments.
   * 2. Calls the `emitLoginRequiredMessage` method from the `SocketIOServices` class, passing an array containing the
   * email address as an argument.
   *
   * Dependencies:
   * The code assumes that the `LoginRequiredModel` and `SocketIOServices` classes have been imported and are available
   * in the current scope.
   */
  static add = async (email: string, type = 'USER_ROLE_CHANGED') => {
    await LoginRequiredModel.bulkAdd([email], type)
    await SocketIOServices.emitLoginRequiredMessage([email])
  }

  /**
   * Bulk Add
   */
  static bulkAdd = async (role: string) => {
    const { data: users = [] } = await UserModel.getByQuery({
      size: 10000,
      query: {
        bool: {
          should: [
            {
              term: {
                role
              }
            }
          ]
        }
      }
    })

    const addItems = users.map((user: User) => user.email)
    await LoginRequiredModel.bulkAdd(addItems)
    await SocketIOServices.emitLoginRequiredMessage(addItems)
  }

  /**
   * Check login required
   */
  static checkLoginRequired = async (browser_email: string, withBrowserPrefix = false) => {
    if (!withBrowserPrefix) {
      return await LoginRequiredModel.checkLoginRequired(browser_email)
    }
    let email = browser_email.split('_')
    email.splice(0, 1)
    return await LoginRequiredModel.checkLoginRequired(email.join('_'))
  }

  /**
   * Delete
   */
  static delete = async (email: string) => {
    await LoginRequiredModel.delete({ body: { _id: email } } as NewRequest)
  }
}

export default LoginRequiredController
