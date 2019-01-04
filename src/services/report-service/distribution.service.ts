import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class DistributionService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 案件导入待分配
   */
  queryOutSoutPoolCase(data,page?,sort?) {
    return this.netService.send({
      server: reportService.distributionController.queryOutSoutPoolCase,
      data:{
        caseNumber: data.caseNumber,
        personalName: data.personalName,
        deptCode: data.deptCode,
        seriesName: data.seriesName,
        overduePeriods: data.overduePeriods,
        mobileNo: data.mobileNo,
        outsId: data.outsId,
        parentAreaId: data.parentAreaId,
        areaId: data.areaId,
        overdueMaxAmt: data.amtRange.max,
        overdueMinAmt: data.amtRange.min,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min,
        idCard: data.idCard
      },
      page,
      sort
    })
  }
  /**
   * 获取委外预分案受托方地区案件
   */
  getOutSourceCaseInfo() {
    return this.netService.send({
      server: reportService.distributionController.getOutSourceCaseInfo
    })
  }
  /**
   * 获取委外预分案汇总数据
   */
  getOutSourceCaseInfoDetail(outId) {
    return this.netService.send({
      server: reportService.distributionController.getOutSourceCaseInfoDetail,
      data: {
        outId:outId
      }
    })
  }

  /**
   * 委外预分案确定分案
   */
  savePredistributionOutSource(data?) {
    return this.netService.send({
      server: reportService.distributionController.savePredistributionOutSource,
      data: {
        caseIdList: data
      }
    })
  }
}

