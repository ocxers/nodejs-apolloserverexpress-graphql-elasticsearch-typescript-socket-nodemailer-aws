import { Router } from 'express'
import UploadController from '@/controllers/UploadController'

const router = Router()

router.post('/', UploadController.uploadImage)

export default router
