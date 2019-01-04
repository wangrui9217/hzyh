import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class BatchManageService {

  @Inject(NetService)
  private netService: NetService

  /**
   * 查询批量处理
   */
  @Debounce()
  queryBatchManage(data, page) {
    return this.netService.send({
      server: businessService.batchManageController.queryBatchManage,
      data: data,
      page: page
    })
  }
  /**
   * 批量处理
   */
  manualBatchManage(data) {
    return this.netService.send({
      server: businessService.batchManageController.manualBatchManage,
      data: data
    })
  }
  /**
   * 暂停触发器
   */
  pauseTriggerForJob(data) {
    return this.netService.send({
      server: businessService.batchManageController.pauseTriggerForJob,
      data: data
    })
  }
  /**
   * 启用触发器
   */
  resumeTriggerForJob(data) {
    return this.netService.send({
      server: businessService.batchManageController.resumeTriggerForJob,
      data: data
    })
  }
}
