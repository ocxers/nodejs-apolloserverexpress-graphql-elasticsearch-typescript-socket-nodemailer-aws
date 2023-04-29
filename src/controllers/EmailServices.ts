import isArray from 'lodash/isArray'
import * as mailHelper from '../utils/mailHelper'
import { MessageType } from '@/interfaces/IMail'
import dotenv = require('dotenv')

const { parsed = {} } = dotenv.config({ debug: true })

const inlineBase64 = require('nodemailer-plugin-inline-base64')

let transport: any
const ses = require('nodemailer-ses-transport')
const nodemailer = require('nodemailer')
const EmailTemplates = require('swig-email-templates')
const templates = new EmailTemplates({
  root: __dirname + '/../emailTemplates',
  text: false,
  juice: {
    webResources: {
      images: 0 // Inline images under 8kB
    }
  }
})

const getLogo = (logo: string | { url: string }[]) => {
  if (isArray(logo)) {
    return logo[0].url
  }

  return logo || `${process.env.EMAIL_HOST || process.env.appHost}/staticImgs/esteelauder.png`
}

const renderEmailTemplateAndSendEmail = function (
  subject: string,
  mailBody: MessageType,
  message: any,
  body: string,
  footer: string
) {
  templates.render(
    'template.notification.html',
    {
      ...mailBody,
      logo: getLogo(message.logo),
      appHost: process.env.EMAIL_HOST || process.env.appHost
    },
    function (err: any, emailContent: any) {
      if (err) {
        return console.log(err)
      }
      emailContent = emailContent.replace('___email_body___', body)
      emailContent = emailContent.replace('___email_footer___', footer)

      const fromTitle = message.fromTitle || 'From title'

      transport.sendMail(
        {
          from: `${fromTitle} <${parsed.NO_REPLY_EMAIL || 'noreply@example.com'}>`,
          to: message.to.email,
          cc: message.sendTo || '',
          subject,
          html: emailContent
        },
        function (err: any) {
          if (err) {
            console.log(err)
          }
        }
      )
    }
  )
}

class EmailServices {
  static initEmailClient = function () {
    if (transport) {
      return
    }

    const sesParams = {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }

    transport = nodemailer.createTransport(ses(sesParams))
    transport.use('compile', inlineBase64({ cidPrefix: 'elc_' }))
  }

  static sendNotificationsMail = async function (message: any, url?: string) {
    const mailBody: any = {
      headerName: message.headerName,
      organizationName: message.organizationName,
      message: message.message,
      url
    }

    renderEmailTemplateAndSendEmail(
      message.message,
      mailBody,
      message,
      mailHelper.generateEmailBody(mailBody),
      mailHelper.generateEmailFooter(mailBody)
    )
  }

  static sendInvitationMail = async function (message: any) {
    const mailBody: any = {
      headerName: message.headerName,
      message: message.message,
      url: message.inviteLink,
      btnText: 'ACTIVATE ACCOUNT',
      footer: 'After 14 days, this link will expire.'
    }

    renderEmailTemplateAndSendEmail(
      'Activate Your Account',
      mailBody,
      message,
      mailHelper.generateEmailBody(mailBody),
      mailHelper.generateEmailFooter(mailBody)
    )
  }

  static sendResetPasswordMail = async function (message: any) {
    const mailBody: any = {
      headerName: message.headerName,
      message: message.message,
      url: message.resetPasswordLink,
      btnText: 'RESET PASSWORD',
      footer: 'After two hours, this link will expire.'
    }

    renderEmailTemplateAndSendEmail(
      'Password Reset',
      mailBody,
      message,
      mailHelper.generateEmailBody(mailBody),
      mailHelper.generateEmailFooter(mailBody)
    )
  }
}

export default EmailServices
