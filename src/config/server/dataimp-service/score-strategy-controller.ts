import { requestType } from '~/config/enum.config'

const SERVICE = 'dataimp-service'
const CONTROLLER = 'scoreStrategyController'

export default {
  /**
   * 保存评分策略
   */
  saveScoreStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'saveScoreStrategy',
    type: requestType.Post
  },
  /**
   * 获取评分规则
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  },
  /**
   * 删除评分规则
   */
  deleteScoreStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteScoreStrategy',
    type: requestType.Delete
  },
}
