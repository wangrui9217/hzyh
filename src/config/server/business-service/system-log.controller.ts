import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'systemLogController'

export default {
  /**
   * 查询特定公司的日志
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  }
}
