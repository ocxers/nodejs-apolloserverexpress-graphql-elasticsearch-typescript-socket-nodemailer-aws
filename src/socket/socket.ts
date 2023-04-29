import { Server } from 'socket.io'
import dotenv = require('dotenv')
import LoginRequiredController from '@/controllers/LoginRequiredController'
import UserModel from '@/models/UserModel'
import { FromToSchema } from '@/typings/common'

const clients: any = {}
const { parsed } = dotenv.config()

const sendLoginRequiredMessage = (client: any) => {
  client.emit('message', {
    message: 'LOGIN_REQUIRED',
    type: 'system'
  })
}

class SocketIOServices {
  /**
   * Method: initSocketIO
   *
   * Type: Static method
   *
   * Parameters:
   * - `server: any`: The HTTP server instance to use for socket connections.
   *
   * Description:
   * This method initializes a new instance of the Socket.IO server, registers a connection event listener, and sets up
   * handlers for 'message' and 'disconnect' events.
   *
   * Operations:
   * 1. Create a new instance of the Socket.IO server using the `Server` constructor from the 'socket.io' library.
   * 2. Configure the server instance with options for cross-origin resource sharing (CORS) and a custom URL path.
   * 3. Register a 'connection' event listener on the server instance that handles incoming socket connections.
   * 4. Within the 'connection' listener, set up handlers for 'message' and 'disconnect' events emitted by the socket.
   * 5. When a 'message' event is emitted, update the `clients` object with the new client and check whether login is
   * required. Emit a 'message' event back to the client with a welcome message and role information. If login is
   * required, emit a 'login_required' event to the client.
   * 6. When a 'disconnect' event is emitted, log a message to the console.
   *
   * Dependencies:
   * - 'socket.io' library
   * - `LoginRequiredController` class
   * - `UserModel` class
   * - `clients` object (presumably defined elsewhere in the code)
   */
  static initSocketIO = (server: any) => {
    const io = new Server(server, {
      cors: {
        origin: (parsed?.SOCKET_URL || process.env.SOCKET_URL)?.split('_'),
        credentials: true
      },
      path: '/__ocxers__/'
    })

    io.on('connection', (socket: any) => {
      socket.on('message', async (message: { email: string }) => {
        // email like: jjpvbsp4zhs_admin@example.com
        clients[message.email] = socket
        const loginRequired = await LoginRequiredController.checkLoginRequired(message.email, true)
        const role = await UserModel.myRole(message.email)
        socket.emit('message', {
          message: `Welcome ${message.email} to __ocxers__...${Date.now()}`,
          role,
          type: 'system'
        })
        if (loginRequired) {
          sendLoginRequiredMessage(socket)
        }
      })
      socket.on('disconnect', () => {
        console.log('>>> io disconnect')
      })
    })

    return io
  }

  /**
   * Method: emitMessage
   *
   * Type: Static method
   *
   * Parameters:
   * - `email: string`: The email address of the user who is initiating the message.
   *
   * Description:
   * This method sends a 'message' event to any connected socket clients whose `key` contains the provided `email`.
   *
   * Operations:
   * 1. Iterate over the keys of the `clients` object using the `Object.keys` method.
   * 2. Check if the current key contains the provided `email` using the `indexOf` method.
   * 3. If the email is present in the key, emit a 'message' event to the corresponding socket client using the `emit`
   * method.
   *
   * Dependencies:
   * - `clients` object (presumably defined elsewhere in the code)
   */
  static emitMessage = async (email: string) => {
    Object.keys(clients).forEach((key) => {
      if (key.indexOf(email) > -1) {
        clients[key].emit('message', { takeover: 'someone asking for edit' })
      }
    })
  }

  /**
   * Method: emitLoginRequiredMessage
   *
   * Type: Static method
   *
   * Parameters:
   * - `emails: string[]`: An array of email addresses for which to emit the 'login required' message.
   *
   * Description:
   * This method emits a 'login required' message to all socket clients whose `key` contains one of the provided email
   * addresses.
   *
   * Operations:
   * 1. Iterate over each email in the provided `emails` array.
   * 2. For each email, iterate over the keys of the `clients` object using the `Object.keys` method.
   * 3. Check if the current key contains the current email using the `indexOf` method.
   * 4. If the email is present in the key, emit the 'login required' message to the corresponding socket client using
   * the `sendLoginRequiredMessage` function.
   *
   * Dependencies:
   * - `clients` object (presumably defined elsewhere in the code)
   * - `sendLoginRequiredMessage` function (presumably defined elsewhere in the code)
   */
  static emitLoginRequiredMessage = async (emails: string[]) => {
    emails.forEach((email) => {
      Object.keys(clients).forEach((key) => {
        if (key.indexOf(email) > -1) {
          sendLoginRequiredMessage(clients[key])
        }
      })
    })
  }

  /**
   * Method: emitNotification
   *
   * Type: Static Asynchronous function
   *
   * Parameters:
   * - email: a string representing the email of the recipient
   * - message: (optional) a string representing the message of the notification
   * - type: (optional) a string representing the type of the notification
   * - from: (optional) a FromToSchema representing the sender of the notification
   * - to: (optional) a FromToSchema representing the recipient of the notification
   * - extraMessage: (optional) a string representing an extra message
   *
   * Description:
   * This method emits a notification to a connected socket client by using the socket.io library. It loops through all
   * connected socket clients and checks for the client matching the provided email parameter. If a matching client is
   * found, it emits a notification event to that client with the provided message, email, type, from, to, and
   * extraMessage parameters.
   *
   * Dependencies:
   * - clients: a global object representing all connected socket clients
   */
  static emitNotification = async (
    email: string,
    message?: string,
    type?: string,
    from?: FromToSchema,
    to?: FromToSchema,
    extraMessage?: string
  ) => {
    Object.keys(clients).forEach((key) => {
      if (key.indexOf(email) > -1) {
        clients[key]?.emit('notification', { message, email, type, from, to, extraMessage })
      }
    })
  }

  /**
   * Method: broadcast
   *
   * Type: Static Method
   *
   * Parameters:
   * - type?: string
   * - args?: any
   *
   * Description:
   * This method broadcasts a notification to all connected clients. It iterates over the `clients` object and sends a
   * notification with the specified `type` and `args` to each of them.
   *
   * Operations:
   * - Iterate over the `clients` object and send a notification to each of them.
   *
   * Dependencies:
   * - The `clients` object should be populated with socket connections.
   */
  static broadcast = async (type?: string, args?: any) => {
    Object.keys(clients).forEach((key) => {
      clients[key]?.emit('notification', { type, ...(args || {}) })
    })
  }
}

export default SocketIOServices
