import { MessageType } from '@/interfaces/IMail'

/**
 * Method: generateEmailBody
 *
 * Type: Function
 *
 * Parameters:
 * - message (MessageType): An object containing information about the email message.
 *
 * Description:
 * This function generates the HTML body of an email message to be sent to a user.
 *
 * Operations:
 * 1. Construct a string containing the email body in HTML format, using the information provided in the 'message'
 * parameter.
 * 2. Return the generated HTML string.
 *
 * Dependencies:
 * None
 */
export const generateEmailBody = (message: MessageType) => {
  // TODO
  return `<p>Thank you __ocxers__.</p>`
}

/**
 * Method: generateEmailFooter
 *
 * Type: Function
 *
 * Parameters:
 * - message: MessageType
 *
 * Description:
 * This function generates the footer of an email message, which includes a greeting and the representative's name.
 *
 * Operations:
 * The function takes a `message` object as a parameter, which is of type `MessageType`. It returns a string that
 * represents the footer of the email message.
 *
 * Dependencies:
 * None.
 */
export const generateEmailFooter = (message: MessageType) => {
  // TODO
  return `<p>
    Best regards,<br>
    ${message.repName ?? ''}
  </p>`
}
