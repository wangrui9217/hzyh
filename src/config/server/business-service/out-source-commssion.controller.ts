import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'outSourceCommssionController'

export default {
  /**
   * 新增/修改委外佣金
   */
  createOutSourceCommssion: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createOutSourceCommssion',
    type: requestType.Post
  },
  /**
   * 删除委外佣金
   */
  deleteOutsourceCommission: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteOutsourceCommission',
    type: requestType.Post
  },
  /**
   * 导出佣金报表
   */
  exportReport: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'exportReport',
    type: requestType.Get
  },
  /**
   * 根据委外方id和公司code码查询委外佣金
   */
  getOutSourceCommission: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getOutSourceCommission',
    type: requestType.Get
  },
  /**
   * 委外佣金报表
   */
  outsourceCommissionForm: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'outsourceCommissionForm',
    type: requestType.Get
  }
}
