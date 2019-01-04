import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class ExportFollowupService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 导出跟进记录
   */
  @Debounce()
  exportFollowupRecord(data) {
    return this.netService.send({
      server: reportService.exportFollowupController.exportFollowupRecord,
      data: data
    })
  }
  /**
   * 案件查找导出跟进记录
   */
  @Debounce()
  exportFollowup(data) {
    return this.netService.send({
      server: reportService.exportFollowupController.exportFollowup,
      data: data
    })
  }
}

