import { requestType } from '~/config/enum.config'

const SERVICE = 'dataimp-service'
const CONTROLLER = 'accImportExcelDataController'

export default {
  /**
   * 通过委托方获取模板名
   */
  getExcelTempleByPrincipalName: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getExcelTempleByPrincipalName',
    type: requestType.Get
  },
  /**
   * 获取Excel模板分页查询
   */
  getExcelTemplateList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getExcelTemplateList',
    type: requestType.Get
  },
  /**
   * 获取Excel映射字段
   */
  getExcelList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'getExcelList',
    type: requestType.Get
  },
  /**
   * 上传excel文件并解析
   */
  importExcelTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importExcelTemplate',
    type: requestType.Get
  },
  /**
 * 检查模板名称是否存在重复
 */
  checkTemplateName: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'checkTemplateName',
    type: requestType.Get
  },
  /**
   * 新增Excel模板配置保存操作
   */
  importExcelTemplateData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'importExcelTemplateData',
    type: requestType.Post
  },
  /**
   * 删除导入模板信息
   */
  deleteExcelData: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'deleteExcelData',
    type: requestType.Delete
  },
  /**
 * 导入模板配置:确认并下载
 */
  createExcelTemplate: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'createExcelTemplate',
    type: requestType.Post
  }
}
