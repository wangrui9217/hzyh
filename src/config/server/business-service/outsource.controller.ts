import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'outsourceController'

export default {
  /**
   * 新增/修改委外方管理
   */
  createOutsource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createOutsource',
    type: requestType.Post
  },
  /**
   * 删除委外方
   */
  deleteOutsource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteOutsource',
    type: requestType.Delete
  },
  /**
   * 统计委托方信息的 案件信息
   */
  getAllOutSourceInfoByCase: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllOutSourceInfoByCase',
    type: requestType.Get
  },
  /**
   * 查询所有委外方
   */
  getAllOutsource: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getAllOutsource',
    type: requestType.Get
  },
  /**
   * 查询委外方
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  }
}
