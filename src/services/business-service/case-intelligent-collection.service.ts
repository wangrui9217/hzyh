import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class CaseIntelligentCollectionService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 短信群发及语音群呼操作
   */
  @Debounce()
  handleBatchSend(cupoIdList, selected, selRelationsList) {
    return this.netService.send({
      server: businessService.caseIntelligentCollectionController.handleBatchSend,
      data: {
        cupoIdList,
        selected,
        selRelationsList
      }
    })
  }
  /**
   * 电子邮件群发操作
   */
  handleEmailSend(emailBatchSendList) {
    return this.netService.send({
      server: businessService.caseIntelligentCollectionController.handleEmailSend,
      data: {
        emailBatchSendList: emailBatchSendList
      }
    })
  }
}
