import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class ExportCaseInfoService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 案件导入待分配
   */
  @Debounce()
  exportCaseInfo(data) {
    return this.netService.send({
      server: reportService.exportCaseInfoController.exportCaseInfo,
      data
    })
  }
}

