import ESHelpers from '@/utils/ESHelpers'
import { NewRequest } from '@/interfaces/Interfaces'
import LoginRequiredController from '@/controllers/LoginRequiredController'

class UserModel {
  static indexName = 'user'
  /**
   * Method: initUserIndex
   *
   * Type: static method
   *
   * Parameters:
   * - config: any - configuration for the indexing, used by ESHelpers.initialIndex
   *
   * Description:
   * This method initializes the Elasticsearch index for User model. It calls ESHelpers.initialIndex with the given
   * configuration and indexName parameters.
   *
   * Operations:
   * - Call ESHelpers.initialIndex with config and indexName parameters.
   *
   * Dependencies:
   * - ESHelpers.initialIndex
   */
  static initUserIndex = async (config: any) => {
    await ESHelpers.initialIndex(config, UserModel.indexName)
  }

  /**
   * List
   */
  static list = () => {
    return ESHelpers.get(UserModel.indexName, {})
  }

  /**
   * Get by query
   */
  static getByQuery = (query: unknown) => {
    return ESHelpers.get(UserModel.indexName, query)
  }

  /**
   * Get by query
   */
  static myRole = async (browser_email: string) => {
    let email = browser_email.split('_')
    email.splice(0, 1)
    const { data: users = [] } = await UserModel.getByQuery({
      size: 100,
      query: {
        bool: {
          should: [
            {
              term: {
                email: email.join('_')
              }
            }
          ]
        }
      }
    })

    return users[0]?.role
  }

  /**
   * List
   */
  static getUsers = (filters: any) => {
    const { username, organization, role, status } = filters
    const musts = []
    if (organization?.length) {
      musts.push({
        terms: {
          organization
        }
      })
    }
    if (role?.length) {
      musts.push({
        terms: {
          role
        }
      })
    }
    if (status?.length) {
      musts.push({
        terms: {
          'status.keyword': status
        }
      })
    }
    const query: any = {
      size: 100,
      query: {
        bool: {
          must: musts
        }
      }
    }
    if (username) {
      query.query.bool.must.push({
        wildcard: {
          username: {
            value: `*${username}*`,
            case_insensitive: true
          }
        }
      })
    }
    return ESHelpers.get(UserModel.indexName, query)
  }

  /**
   * List
   */
  static getByEmail = (email?: string) => {
    const query: any = {
      query: {
        bool: {
          must: {
            term: {
              email
            }
          }
        }
      }
    }
    return ESHelpers.get(UserModel.indexName, query)
  }

  /**
   * List
   */
  static getById = (id?: string) => {
    const query: any = {
      query: {
        bool: {
          must: {
            term: {
              _id: id
            }
          }
        }
      }
    }
    return ESHelpers.get(UserModel.indexName, query)
  }

  /**
   * Add
   */
  static addUser = async (req: NewRequest, item: any) => {
    const user = req?.user || {}
    const { data: usersByEmail = [] } = await this.getByEmail(item.email)
    if (usersByEmail.length > 0) {
      return {
        code: 400,
        data: `Email "${item.email}" already exists in our system.`
      }
    } else {
      return ESHelpers.addDirectly(UserModel.indexName, {
        ...item,
        created: {
          createdBy: {
            uid: user.uid,
            displayName: user.displayName
          },
          createdAt: Date.now()
        }
      })
    }
  }

  /**
   * Add
   */
  static updateUser = async (req: NewRequest, item: any) => {
    const { data: usersByEmail = [] } = await this.getByEmail(item.email)
    if (usersByEmail.length > 1) {
      return {
        code: 400,
        data: `Email "${item.email}" already exists in our system.`
      }
    } else if (usersByEmail.findIndex((user: any) => user.email === item.email && user.id !== item.id) > -1) {
      return {
        code: 400,
        data: `Email "${item.email}" already exists in our system.`
      }
    } else {
      const res = await ESHelpers.update(req, UserModel.indexName, item)
      const previousItem = usersByEmail[0]
      if (previousItem.role !== item.role) {
        // Role changed
        await LoginRequiredController.add(previousItem.email)
      }
      return res
    }
  }

  /**
   * Active account
   */
  static activateUser = async (req: NewRequest, item: any) => {
    const { data: usersByEmail = [] } = await this.getByEmail(item.email)
    if (usersByEmail.length > 1) {
      return {
        code: 400,
        data: `Email "${item.email}" already exists in our system.`
      }
    } else {
      return ESHelpers.update(req, UserModel.indexName, item)
    }
  }

  /**
   * Update order
   */
  static updateOrder = (items: any) => {
    return ESHelpers.bulkUpdate(UserModel.indexName, items)
  }

  /**
   * Delete
   */
  static deleteUser = async (id: string) => {
    const { data } = await UserModel.getById(id)
    const res = await ESHelpers.deleteByQuery(UserModel.indexName, {
      query: {
        terms: {
          _id: [id]
        }
      }
    })
    if (data?.[0]) {
      await LoginRequiredController.add(data[0].email, 'DELETE_USER')
    }
    return res
  }
}

export default UserModel
