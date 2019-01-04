import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'dataDictController'

export default {
  /**
   * 获取数据字典
   */
  getAll: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAll',
    type: requestType.Get
  },
  /**
   * 获取数据字典HASH
   */
  getHashCode: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getHashCode',
    type: requestType.Get
  }
}
