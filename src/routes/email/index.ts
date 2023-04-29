import { Router } from 'express'
import MailController from '@/controllers/MailController'

const router = Router()

router.post('/', MailController.send as any)

export default router
