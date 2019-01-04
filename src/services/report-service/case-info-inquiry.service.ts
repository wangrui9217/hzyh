import { reportService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';
export class CaseInfoInquiryService {
  @Inject(NetService)
  private netService: NetService

  /**
   * 短信催收列表分页
   */
  @Debounce()
  getCaseInfoByNoPower(data, page?) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getCaseInfoByNoPower,
      data: {
        personalName: data.personalName,
        collectorName: data.collectorName,
        orderId: data.orderId,
        collectionType: data.collectionType,
        collectionStatusList: data.collectionStatusList,
        batchNumber: data.batchNumber,
        principalId: data.principalId,
        overMinDay: data.dayRange.min,
        overMaxDay: data.dayRange.max,
        principalName: data.principalName,
      },
      page
    })
  }
  /**
   * PC电催和外访
   */
  getCaseInfoByCondition(data, page, sort) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getCaseInfoByCondition,
      data: {
        caseNumber: data.caseNumber,
        personalName: data.personalName, // 客户姓名
        mobileNo: data.mobileNo, // 手机号
        mobileNoX: data.mobileNoX,
        batchNumber: data.batchNumber, // 批次号
        overdueMinAmt: data.caseMoney.min, // 最小案件金额
        overdueMaxAmt: data.caseMoney.max, // 最大案件金额
        overMaxDay: data.dayRange.max, // 最大逾期天数
        overMinDay: data.dayRange.min, // 最小逾期天数
        realPayMinAmt: data.realPayAmount.min, // 最小还款金额
        realPayMaxAmt: data.realPayAmount.max, // 最大还款金额
        orderId: data.orderId, // 批次号
        collectionStatus: data.collectionStatus, // 状态
        principalId: data.principalId, // 委托方
        idCard: data.idCard,// 身份证
        collectorName: data.collectorName, // 催收员
        code: data.deptCode, // 机构
        assistFlag: data.assistFlag, // 是否协催
        assistWay: data.assistWay, // 协催方式
        caseMark: data.caseMark, // 案件标记
        companyCode: data.companyCode, // 公司code
        followupBack: data.followupBack, // 催收反馈
        overdueDays: data.overdueDays, // 逾期天数
        cupoName: data.cupoName,
        payStatus: data.payStatus,// 逾期期数
        collectionType: data.collectionType,
        collectionStatusList: data.collectionStatusList,
        pageFlag: data.pageFlag,
        overDuePayStatus: data.overDuePayStatus,
        employeeRealName: data.employeeRealName, // 业务经理
        deptName: data.deptName,
        shopDeptId: data.shopDeptId,
        leftDueDays: data.leftDueDays,
        lawsuitResult: data.lawsuitResult, //诉讼阶段
        antiFraudResult: data.antiFraudResult, //反欺诈反馈
        startFollowDate: FilterService.dateRanageFormat(data.followupTime).start, //跟进时间 开始
        endFollowDate: FilterService.dateRanageFormat(data.followupTime).end,  //跟进时间  结束
        caseFollowInTime: FilterService.dateFormat(data.caseFollowInTime), //案件流入时间
        seriesName: data.seriesName, //产品类型
        parentAreaId: data.cityList ? data.cityList[0] : "",
        areaId: data.cityList ? data.cityList[1] : "",
        productName: data.productName, //产品名称
        lastCollectorName: data.lastCollectorName, //上一个催收员
        turnFromPool: data.turnFromPool, // 流转来源
        turnToPool: data.turnToPool, // 流转去向
        turnApprovalStatus: data.turnApprovalStatus, //流转状态
      },
      page: page,
      sort: sort
    })
  }
  /**
   * PC协催
   */
  getCaseAssistByCondition(data, page?, sort?) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getCaseAssistByCondition,
      data: {
        orderId: data.orderId,
        personalName: data.personalName,
        companyCode: data.companyCode,
        mobileNo: data.mobileNo,
        assistStatusList: data.assistStatusList,
        overdueMinAmt: data.amountRange.min,
        overdueMaxAmt: data.amountRange.max
      },
      page,
      sort
    })
  }
  /**
   * 内催按批次号查询催收中案件
   */
  getInnerCaseInfoByCondition(data, page) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getInnerCaseInfoByCondition,
      data: {
        personalName: data.personalName,
        principalId: data.principalId,
        mobileNo: data.mobileNo,
        delegationDateMin: FilterService.dateRanageFormat(data.delegationDate).start,
        delegationDateMax: FilterService.dateRanageFormat(data.delegationDate).end,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        collectionType: data.collectionType,
        collectionStatusList: data.collectionStatusList,
        batchNumber: data.batchNumber
      },
      page: page
    })
  }
  /**
   * 获取产品系列和产品名称
   */
  getProductSeries() {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getProductSeries,
    })
  }
  /**
   * 查询内催待分配
   */
  getInnerWaitCollectCase(data, page, sort?) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getInnerWaitCollectCase,
      data: {
        caseNumber: data.caseNumber,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        idCard: data.idCard,
        batchNumber: data.batchNumber,
        deptCode: data.deptCode,
        principalId: data.principalId,
        collectorName: data.collectorName,
        lastCollectorName: data.lastCollectorName,
        overdueMaxAmt: data.overdueAmount.max,
        overdueMinAmt: data.overdueAmount.min,
        payStatus: data.payStatus,
        overMaxDay: data.overDays.max,
        overMinDay: data.overDays.min,
        followupBack: data.followupBack,
        turnFromPool: data.turnFromPool,
        lawsuitResult: data.lawsuitResult,
        antiFraudResult: data.antiFraudResult,
        seriesName: data.seriesName,
        parentAreaId: data.parentAreaId,
        areaId: data.areaId,
        turnToPool: data.turnToPool,
        turnApprovalStatus: data.turnApprovalStatus,
        startFollowDate: FilterService.dateRanageFormat(data.followDate).start,
        endFollowDate: FilterService.dateRanageFormat(data.followDate).end,
        caseFollowInTime: FilterService.dateFormat(data.caseFollowInTime),
        productName: data.productName,
        personalType: data.personalType,
        collectionStatusList: data.collectionStatusList,
        collectionStatus: data.collectionStatus,
      },
      page,
      sort
    })
  }
  /**
   * 多条件查询司法案件
   */
  getCaseInfoJudicialByCondition(data, page?) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getCaseInfoJudicialByCondition,
      data: {
        personalName: data.personalName,
        companyCode: data.companyCode,
        payStatus: data.payStatus,
        mobileNo: data.mobileNo,
        principalName: data.principalName,
        batchNumber: data.batchNumber,
        idCard: data.idCard,
        overdueMaxAmt: data.overdueAmount.max,
        overdueMinAmt: data.overdueAmount.min,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min
      },
      page
    })
  }
  /**
   * 多条件查询修复案件
   */
  getAllRepairingCase(data, page) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getAllRepairingCase,
      data: {
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min,
        companyCode: data.companyCode,
        personalName: data.personalName,
        principalName: data.principalName,
        overdueMaxAmt: data.overdueAmount.max,
        overdueMinAmt: data.overdueAmount.min,
        repairStatus: data.repairStatus,
        payStatus: data.payStatus
      },
      page
    })
  }
  /** 
  * 获取产品系列和产品名称   查询流转记录
  */
  getCaseTurnRecord(data, page, sort) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getCaseTurnRecord,
      data,
      page,
      sort
    })
  }

  /**
   * 特殊案件管理-待分配
   */
  getWaitCaseByPoolType(data, page?, sort?) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getWaitCaseByPoolType,
      data: {
        caseNumber: data.caseNumber,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        idCard: data.idCard,
        batchNumber: data.batchNumber,
        code: data.deptCode,
        seriesName: data.seriesName,
        turnFromPool: data.turnFromPool,
        collectorName: data.collectorName,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        payStatus: data.payStatus,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min,
        followupBack: data.followupBack,
        lawsuitResult: data.lawsuitResult,
        antiFraudResult: data.antiFraudResult,
        caseFollowInTime: FilterService.dateFormat(data.caseFollowInTime),
        personalType: data.personalType,
        productName: data.productName,
        parentAreaId: data.parentAreaId,
        areaId: data.areaId,
        casePoolType: data.casePoolType,
        collectionStatusList: data.collectionStatusList,
        collectionType: data.collectionType
      },
      page,
      sort
    })
  }

  /**
   * 特殊案件管理-催收中、归C、已结清
   */
  getCaseByPoolTypeAndCondition(data, page?, sort?) {
    return this.netService.send({
      server: reportService.caseInfoInquiryController.getCaseByPoolTypeAndCondition,
      data: {
        caseNumber: data.caseNumber,
        personalName: data.personalName,
        mobileNo: data.mobileNo,
        idCard: data.idCard,
        batchNumber: data.batchNumber,
        code: data.deptCode,
        seriesName: data.seriesName,
        collectorName: data.collectorName,
        lastCollectorName: data.lastCollectorName,
        overdueMinAmt: data.amtRange.min,
        overdueMaxAmt: data.amtRange.max,
        payStatus: data.payStatus,
        overMaxDay: data.overdueDays.max,
        overMinDay: data.overdueDays.min,
        followupBack: data.followupBack,
        turnFromPool: data.turnFromPool,
        lawsuitResult: data.lawsuitResult,
        antiFraudResult: data.antiFraudResult,
        startFollowDate: FilterService.dateRanageFormat(data.followupTime).start, //跟进时间 开始
        endFollowDate: FilterService.dateRanageFormat(data.followupTime).end,  //跟进时间  结束
        caseFollowInTime: FilterService.dateFormat(data.caseFollowInTime),
        personalType: data.personalType,
        delegationDate: data.delegationDate,
        turnToPool: data.turnToPool,
        turnApprovalStatus: data.turnApprovalStatus,
        productName: data.productName,
        parentAreaId: data.parentAreaId,
        areaId: data.areaId,
        assistWay: data.assistWay,
        casePoolType: data.casePoolType,
        collectionStatusList: data.collectionStatusList,
        collectionType: data.collectionType
      },
      page,
      sort
    })
  }
}

