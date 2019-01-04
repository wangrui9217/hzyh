import { requestType } from '~/config/enum.config'

const SERVICE = 'report-service'
const CONTROLLER = 'QueryOutsourcePoolController'

export default {
  /**
   * 委外催收中查询
   */
  queryAllOutsourcePool: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryAllOutsourcePool',
    type: requestType.Get
  },
  /**
   * 委外催收中查询
   */
  queryDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryDistribute',
    type: requestType.Get
  },
  /**
   * 委外归C查询
   */
  queryCleanUp: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCleanUp',
    type: requestType.Get
  },
  /**
   *委外回收案件查询
   */
  queryReturn: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryReturn',
    type: requestType.Get
  },
}
