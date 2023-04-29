import { Router } from 'express'
import emailApi from './email'
import uploadApi from './upload'

const authRoutes = Router()
const publicRoutes = Router()

authRoutes.use('/email', emailApi)
authRoutes.use('/upload', uploadApi)

export default {
  publicRoutes,
  authRoutes
}
