import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class QueryOutsourcePoolService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 委外催收中查询
   */
  @Debounce()
  queryAllOutsourcePool(data, page?) {
    return this.netService.send({
      server: reportService.queryOutsourcePoolController.queryAllOutsourcePool,
      data: {
        companyCode: data.companyCode,
        batchNumber: data.batchNumber,
        outsId: data.outsId,
        type: data.type,
        outTimeStart: FilterService.dateRanageFormat(data.outTime).start,
        outTimeEnd: FilterService.dateRanageFormat(data.outTime).end,
        overOutsourceTimeStart: FilterService.dateRanageFormat(data.overOutsourceTime).start,
        overOutsourceTimeEnd: FilterService.dateRanageFormat(data.overOutsourceTime).end
      },
      page
    })
  }
  /**
   * 委外已结清查询
   * @param data
   * @param page
   */
  @Debounce()
  queryDistribute(data, page?) {
    return this.netService.send({
      server: reportService.queryOutsourcePoolController.queryDistribute,
      data: {
        caseNumber: data.caseNumber,
        seriesId: data.seriesId,
        companyCode: data.companyCode,
        batchNumber: data.batchNumber,
        principalId: data.principalId,
        payStatus: data.payStatus,
        realName: data.collectorName,
        followupBack: data.followupBack,
        personalName: data.personalName,
        turnFromPool: data.turnFromPool,
        lawsuitResult: data.lawsuitResult,
        antiFraudResult: data.antiFraudResult,
        caseFollowInTime: FilterService.dateTimeFormat(data.caseFollowInTime),
        areaId: data.parentAreaId,
        cityId: data.areaId,
        mobileNo: data.mobileNo,
        idCard: data.idCard,
        outsId: data.outsId,
        departId: data.deptCode,
        outStatus: data.outStatus,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        overMinDay: data.overdueDays.min,
        overMaxDay: data.overdueDays.max
      },
      page
    })
  }
  /**
   * 委外已结清查询
   */
  queryCleanUp(data, page?) {
    return this.netService.send({
      server: reportService.queryOutsourcePoolController.queryCleanUp,
      data: {
        caseNumber: data.caseNumber,
        companyCode: data.companyCode,
        batchNumber: data.batchNumber,
        principalId: data.principalId,
        overduePeriods: data.overduePeriods,
        collectorName: data.collectorName,
        followupBack: data.followupBack,
        personalName: data.personalName,
        turnFromPool: data.turnFromPool,
        lawsuitResult: data.lawsuitResult,
        antiFraudResult: data.antiFraudResult,
        followupTime: FilterService.dateFormat(data.followupTime),
        parentAreaId: data.parentAreaId,
        areaId: data.areaId,
        mobileNo: data.mobileNo,
        idCard: data.idCard,
        outsId: data.outsId,
        deptCode: data.deptCode,
        outStatus: data.outStatus,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        overMinDay: data.overdueDays.min,
        overMaxDay: data.overdueDays.max
      },
      page
    })
  }
  /**
   * 委外回收案件查询
   */
  @Debounce()
  queryReturn(data, page?) {
    return this.netService.send({
      server: reportService.queryOutsourcePoolController.queryReturn,
      data: {
        overOutsourceTimeStart: FilterService.dateRanageFormat(data.overOutsourceTime).start,
        overOutsourceTimeEnd: FilterService.dateRanageFormat(data.overOutsourceTime).end,
        overdueMinAmt: data.overdueAmount.min,
        overdueMaxAmt: data.overdueAmount.max,
        overMinDay: data.overdueDays.min,
        overMaxDay: data.overdueDays.max,
        companyCode: data.companyCode,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        idCard: data.idCard,
        batchNumber: data.batchNumber,
        outsId: data.outsId,
        payStatus: data.payStatus,
        caseNumber: data.caseNumber,
        departId: data.deptCodes,
        caseMark: data.caseMark,
        principalId: data.principalId,
        collector: data.collector,
        seriesId: data.seriesId,
        follFeedbacks: data.follFeedbacks,
        turnFromPool: data.turnFromPool,
        lawsuitResult: data.lawsuitResult,
        antiFraudResult: data.antiFraudResult,
        startFollowDate: FilterService.dateRanageFormat(data.followupTime).start, //跟进时间 开始
        endFollowDate: FilterService.dateRanageFormat(data.followupTime).end,  //跟进时间  结束
        caseFollowInTime: FilterService.dateFormat(data.caseFollowInTime), //案件流入时间
        turnToPool: data.turnToPool, //流转去向
        turnStatus: data.turnStatus, //流转状态
        areaId: data.cityList ? data.cityList[0] : "",
        cityId: data.cityList ? data.cityList[1] : ""
      },
      page: page
    })
  }
}



