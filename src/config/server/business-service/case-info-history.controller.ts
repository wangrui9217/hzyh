import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'caseInfoHistoryController'

export default {
  /**
   * 内催已结案案件删除
   */
  deleteInnerCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteInnerCase',
    type: requestType.Post
  },
  /**
   * 委外已结案案件删除
   */
  deleteOuterCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteOuterCase',
    type: requestType.Post
  },
  /**
   * 回收案件删除
   */
  deleteReturnCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteReturnCase',
    type: requestType.Post
  }
}
