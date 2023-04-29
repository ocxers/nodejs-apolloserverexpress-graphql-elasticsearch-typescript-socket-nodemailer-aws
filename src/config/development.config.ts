import { ConfigType } from '@/typings/common'

const jwtSecret = '__ocxers__@20230214'
const esUrl = 'http://localhost:9200/'
const config: ConfigType = {
  jwtSecret,
  esUrl
}

export default config
