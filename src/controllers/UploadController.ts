import { Request, Response } from 'express'
import { NewRequest } from '@/interfaces/Interfaces'
import * as path from 'path'
import S3 from 'aws-sdk/clients/s3'
import dotenv = require('dotenv')

dotenv.config({ debug: true })

const crypto = require('crypto')
const _ = require('lodash')
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  // multers disk storage settings
  destination: (req: Request, file: any, cb: any) => {
    cb(null, path.resolve(__dirname, '../uploads/'))
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
    )
  }
})

const uploadImageData = multer({
  // multer settings
  storage: storage,
  fileFilter: function (req: Request, file: any, callback: any) {
    callback(null, true)
  }
}).single('file')

const resetObjectValues = (obj: any) => {
  _.keys(obj).map((key: any) => {
    const tempObj: any = obj[key]
    if (typeof tempObj === 'object' && _.keys(tempObj)) {
      resetObjectValues(tempObj)
    } else {
      if (_.isArray(tempObj)) {
        obj[key] = []
      } else {
        obj[key] = ''
      }
    }
  })
}

class UploadController {
  /**
   * Upload image to s3 server
   */
  static uploadImage = async (oriReq: Request, res: Response) => {
    const req = oriReq as NewRequest
    const AWSS3 = {
      bucket: process.env.S3_BUCKET,
      folder: process.env.S3_FOLDER,
      AccessKeyID: process.env.S3_ACCESS_KEY_ID,
      SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }

    const uid = req.user.id
    const s3: any = new S3({
      accessKeyId: AWSS3.AccessKeyID,
      secretAccessKey: AWSS3.SecretAccessKey
    })
    const region = 'us-east-1'
    const path = AWSS3.folder + '/__ocxers__/' + uid + '/documents/'

    const date =
      new Date()
        .toISOString()
        .replace(/[.\-:]/gi, '')
        .substr(0, 15) + 'Z'
    const dateNowRaw = date.substr(0, date.indexOf('T'))

    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 1)
    const expiration = expirationDate.toISOString()

    const credentials = AWSS3.AccessKeyID + '/' + dateNowRaw + '/' + region + '/s3/aws4_request'
    const acl = 'public-read'
    const policy = {
      expiration: expiration,
      conditions: [
        { bucket: AWSS3.bucket },
        { acl: acl },
        ['starts-with', '$key', path],
        ['starts-with', '$Content-Type', req.query.filetype || ''],
        { 'x-amz-credential': credentials },
        { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
        { 'x-amz-date': date }
      ]
    }

    const base64Policy = Buffer.from(JSON.stringify(policy), 'utf-8').toString('base64')
    const dateKey = crypto
      .createHmac('sha256', 'AWS4' + AWSS3.SecretAccessKey)
      .update(dateNowRaw)
      .digest()
    const dateRegionKey = crypto.createHmac('sha256', dateKey).update(region).digest()
    const dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update('s3').digest()
    const signingKey = crypto.createHmac('sha256', dateRegionServiceKey).update('aws4_request').digest()
    const signature = crypto.createHmac('sha256', signingKey).update(base64Policy).digest('hex')

    uploadImageData(req, res, (err: any) => {
      if (err) {
        res.json({ code: 400, err: err })
        return
      }

      /** Multer gives us file info in req.file object */
      if (!req.file) {
        res.json({ code: 400, err: 'No file passed' })
        return
      }

      fs.readFile(req.file.path, (err: any, imageData: any) => {
        // delete file from uploads/
        fs.unlinkSync(req.file.path)
        if (err) {
          res.json({
            code: 400,
            err: err
          })
          return
        }

        const params = {
          Bucket: AWSS3.bucket, // pass your bucket name
          Key: path + req.query.filename, // file will be saved as testBucket/contacts.csv
          Body: imageData,
          ACL: acl,
          Policy: base64Policy,
          'X-Amz-Date': date,
          'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          'X-Amz-Credential': credentials,
          'X-Amz-Signature': signature,
          ContentType: decodeURIComponent(req.query.filetype as string)
        }

        s3.upload(params, function (s3Err: any, data: any) {
          if (s3Err) {
            res.json({
              code: 400,
              err: s3Err
            })
          } else {
            res.json({
              code: 0,
              data: data.Location
            })
          }
        })
      })
    })
  }
}

export default UploadController
