import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class TemplateService {

  @Inject()
  private netService: NetService

  /**
   * 模板按条件查询
   */
  @Debounce()
  getTemplatesByCondition(data, page?) {
    return this.netService.send({
      server: businessService.templateController.getTemplatesByCondition,
      data: {
        templateStyle: data.templateStyle, // 模版形式
        templateType: data.templateType, // 模版类型
        templateName: data.templateName, // 模版名称
        templateStatus: data.templateStatus, //  模版状态
        companyName: data.companyName,
        companyCode: data.companyCode
      },
      page: page
    })
  }
  /**
   * 判断修改模板名称、编号是否可用
   */
  @Debounce()
  getTemplateByNameOrCode(data) {
    return this.netService.send({
      server: businessService.templateController.getTemplateByNameOrCode,
      data: {
        id: data.id,
        companyName: data.companyName,
        companyCode: data.companyCode
      }
    })
  }
  /**
   * 新增模板信息
   */
  @Debounce()
  createTemplate(data) {
    return this.netService.send({
      server: businessService.templateController.createTemplate,
      data: {
        templateStyle: data.templateStyle, // 模版形式
        templateType: data.templateType, // 模版类型
        templateName: data.templateName, // 模版名称
        templateStatus: data.templateStatus, //  模版状态
        companyCode: data.companyCode,
        templateCode: data.templateCode,
        isDefault: data.isDefault,
        messageContent: data.messageContent
      }
    })
  }
  /**
   * 更新模板信息
   */
  @Debounce()
  updateTemplate(data) {
    return this.netService.send({
      server: businessService.templateController.updateTemplate,
      data: {
        templateStyle: data.templateStyle, // 模版形式
        templateType: data.templateType, // 模版类型
        templateName: data.templateName, // 模版名称
        templateStatus: data.templateStatus, //  模版状态
        companyCode: data.companyCode,
        templateCode: data.templateCode,
        isDefault: data.isDefault,
        messageContent: data.messageContent,
        id: data.id
      }
    })
  }
  /**
   * 根据id删除模板
   */
  @Debounce()
  deleteTemplateById(data) {
    return this.netService.send({
      server: businessService.templateController.deleteTemplateById,
      data: {
        id: data
      }
    })
  }
  /** 
   * 根据模板形式查询启用的模板
  */
  @Debounce()
  getTemplatesByStyle(data) {
    return this.netService.send({
      server: businessService.templateController.getTemplatesByStyle,
      data: {
        style: data
      }
    })
  }
}

