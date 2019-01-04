import { requestType } from '~/config/enum.config'

const SERVICE = 'dataimp-service'
const CONTROLLER = 'obtainTaticsStrategyController'

export default {
  /**
   * 生成案件分配策略
   */
  addObtainTaticsStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addObtainTaticsStrategy',
    type: requestType.Post
  },
  /**
   * 分配策略按条件分页查询
   */
  getObtainTaticsStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getObtainTaticsStrategy',
    type: requestType.Get
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
  deleteObtainTaticsStrategy: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteObtainTaticsStrategy',
    type: requestType.Get
  },
  /**
   * 获取产品类型
   */
  selectProductSeries: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'selectProductSeries',
    type: requestType.Get
  },
  /**
   * 策略分案每天
   */
  everyDayDivisionCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'everyDayDivisionCase',
    type: requestType.Post
  },
  /**
   * 策略分案月初
   */
  monthEarlyDivisionCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'monthEarlyDivisionCase',
    type: requestType.Post
  }

}
