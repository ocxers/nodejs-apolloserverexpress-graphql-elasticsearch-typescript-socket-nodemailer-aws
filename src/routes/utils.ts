import { NextFunction, Request, Response, Router } from 'express'
import { NewRequest } from '@/interfaces/Interfaces'

const router = Router()

router.get('/whoami', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    code: 0,
    data: (req as NewRequest).user
  })
})

export default router
