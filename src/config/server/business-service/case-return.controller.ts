import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseReturnController'

export default {
  /**
   * 回收案件移入司法案件池
   */
  moveToJudicial: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'moveToJudicial',
    type: requestType.Post
  },
  /**
   * 回收案件移入核销案件池
   */
  moveToVerification: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'moveToVerification',
    type: requestType.Post
  },
  /**
   * 重新分配回收案件
   */
  reDisRecoverCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'reDisRecoverCase',
    type: requestType.Post
  },
  /**
   * 内催回收案件
   */
  recoverCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'recoverCase',
    type: requestType.Post
  }
}
