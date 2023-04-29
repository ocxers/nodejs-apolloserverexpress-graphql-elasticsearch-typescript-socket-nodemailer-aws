import { Request, Response } from 'express'
import { NewRequest } from '@/interfaces/Interfaces'
import EmailServices from './EmailServices'

class MailController {
  /**
   * Send mail
   */
  static send = async (requ: Request, res: Response) => {
    let req = requ as NewRequest
    let { body } = req
    switch (body.type) {
      case 'thank':
        EmailServices.sendNotificationsMail(body)
        break
      case 'invitation':
        EmailServices.sendInvitationMail(body)
        break
      case 'reset-password':
        EmailServices.sendResetPasswordMail(body)
        break
    }
  }
}

export default MailController
