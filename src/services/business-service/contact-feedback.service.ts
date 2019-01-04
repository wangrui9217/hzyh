import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";


export class ContactFeedbackService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 获取定义为失联案件的相关信息
   */
  invalidContactCase(data,page?, sort?) {
    return this.netService.send({
      server: businessService.contactFeedbackController.invalidContactCase,
      data,
      page,
      sort
    })
  }
  /**
   * 失联案件导出
   */
  invalidContactCaseExport() {
    return this.netService.send({
      server: businessService.contactFeedbackController.invalidContactCaseExport

    })
  }


}