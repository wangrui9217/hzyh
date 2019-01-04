import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'templateController'

export default {
  /**
   * 模板按条件分页查询
   */
  getTemplatesByCondition: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplatesByCondition',
    type: requestType.Get
  },
  /**
   * 新增模板信息
   */
  createTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createTemplate',
    type: requestType.Post
  },
  /**
   * 根据模板ID删除模板
   */
  deleteTemplateById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteTemplateById',
    type: requestType.Delete
  },
  /**
   * 根据模板ID查询模板
   */
  getTemplateById: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplateById',
    type: requestType.Get
  },
  /**
   * 判断修改模板名称、编号是否可用
   */
  getTemplateByNameOrCode: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplateByNameOrCode',
    type: requestType.Get
  },
  /**
   * 查询模板形式
   */
  getTemplateStyle: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplateStyle',
    type: requestType.Get
  },
  /**
   * 查询模板类别
   */
  getTemplateType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplateType',
    type: requestType.Get
  },
  /**
   * 根据模板形式、类别、名称查询启用的模板
   */
  getTemplatesByStyleAndType: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplatesByStyleAndType',
    type: requestType.Get
  },
  /**
   * 根据模板形式查询启用的模板
   */
  getTemplatesByStyle: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getTemplatesByStyle',
    type: requestType.Get
  },
  /**
   * 更新模板信息
   */
  updateTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'updateTemplate',
    type: requestType.Put
  }
}
