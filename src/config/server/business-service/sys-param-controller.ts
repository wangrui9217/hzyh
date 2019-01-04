import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'sysParamController'

export default {
  /**
   * 系统参数带条件的分页查询
   */
  query: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'query',
    type: requestType.Get
  },
  /**
   * 新增/修改系统参数
   */
  createSysParam: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createSysParam',
    type: requestType.Post
  },
  /**
   * 修改模板地址
   */
  modifyTemplateUrl: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'modifyTemplateUrl',
    type:  requestType.Post
  }
}
