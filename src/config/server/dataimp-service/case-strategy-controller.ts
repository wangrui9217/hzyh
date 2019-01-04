import { requestType } from '~/config/enum.config'

const SERVICE = 'dataimp-service'
const CONTROLLER = 'caseStrategyController'

export default {
  /**
   * 生成案件分配策略
   */
  addCaseStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addCaseStrategy',
    type: requestType.Post
  },
  /**
   * 分配策略按条件分页查询
   */
  getCaseStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getCaseStrategy',
    type: requestType.Get
  },
  /**
   * 预览案件生成规则
   */
  queryCaseInfoByCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'queryCaseInfoByCondition',
    type: requestType.Post
  },
  /**
   * 策略分配案件
   */
  smartDistribute: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'smartDistribute',
    type: requestType.Post
  },
  /**
   * 检查策略名称是否重复
   */
  findCaseStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findCaseStrategy',
    type: requestType.Get
  },
  /**
   * 删除策略
   */
  deleteCaseStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteCaseStrategy',
    type: requestType.Get
  }
}
