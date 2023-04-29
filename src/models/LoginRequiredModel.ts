import { NewRequest } from '@/interfaces/Interfaces'
import ESHelpers from '@/utils/ESHelpers'

class LoginRequiredModel {
  static indexName = 'login_required'
  /**
   * Initial Index
   */
  static initLoginRequiredIndex = (config: any) => {
    ESHelpers.initialIndex(config, LoginRequiredModel.indexName)
  }

  /**
   * Add
   */
  static bulkAdd = async (items: any, type = 'USER_ROLE_CHANGED') => {
    return ESHelpers.bulkAddNotExistItems(LoginRequiredModel.indexName, items, type)
  }

  /**
   * Check login required
   */
  static checkLoginRequired = async (email: string) => {
    const { data = [] } = await ESHelpers.getById(LoginRequiredModel.indexName, email)
    return data.length > 0
  }

  /**
   * Delete doc
   */
  static delete = (req: NewRequest) => {
    return ESHelpers.deleteById(LoginRequiredModel.indexName, req.body._id)
  }
}

export default LoginRequiredModel
