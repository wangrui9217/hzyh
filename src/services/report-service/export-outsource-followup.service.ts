import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class ExportOutsourceFollowupService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 导出委外跟进记录
   */
  @Debounce()
  exportOutsourceFollowupRecord(data, type, batchNumberList, outsIdList, caseNumberList) {
    return this.netService.send({
      server: reportService.exportOutsourceFollowupController.exportOutsourceFollowupRecord,
      data: {
        companyCode: data.companyCode,
        batchNumber: data.batchNumber,
        outsId: data.outsId,
        type,
        outsIdList,
        batchNumberList,
        caseNumberList,
        outTimeStart: FilterService.dateRanageFormat(data.outTime).start,
        outTimeEnd: FilterService.dateRanageFormat(data.outTime).end,
        overOutsourceTimeStart: FilterService.dateRanageFormat(data.overOutsourceTime).start,
        overOutsourceTimeEnd: FilterService.dateRanageFormat(data.overOutsourceTime).end      
      }
    })
  }
}

