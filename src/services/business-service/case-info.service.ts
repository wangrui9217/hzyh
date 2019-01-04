import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service'
import { Service } from "~/core/service"
export class CaseInfoService extends Service {

  @Inject(NetService)
  private netService: NetService
  /**
   * 查看材料
   */
  getFollowupFile(data) {
    return this.netService.send({
      server: businessService.caseInfoController.getFollowupFile,
      data: data
    })
  }
  /**
   * 查看附件
   */
  findUpload(caseNumber, companyCode = '') {
    return this.netService.send({
      server: businessService.caseInfoController.findUpload,
      data: {
        caseNumber,
        companyCode
      }
    })
  }
  /**
   * 案件查找
   */
  findCaseInfo(data, page) {
    return this.netService.send({
      server: businessService.caseInfoController.findCaseInfo,
      data: {
        'personalInfo.mobileNo': data.mobileNo,
        'personalInfo.name': data.personName,
        "principal.id": data.principalId,
        "area.parent.id": data.parentAreaId,
        "area.id": data.areaId
      },
      page
    })
  }
  /**
   * 修改备注
   */
  modifyCaseMemo(data) {
    return this.netService.send({
      server: businessService.caseInfoController.modifyCaseMemo,
      data
    })
  }
  /**
   * 分页查询内催待分配案件
   */
  getInnerWaitCollectCase(data, page) {
    return this.netService.send({
      server: businessService.caseInfoController.getInnerWaitCollectCase,
      data: {
        'personalInfo.name': data.name,
        'personalInfo.mobileNo': data.mobileNo,
        'personalInfo.idCard': data.idCard,
        'principalId.id': data.principalId,
        batchNumber: data.batchNumber,
        'area.parent.id': data.parentAreaId,
        'area.id': data.areaId,
        commissionRate: [data.commissionRate.min, data.commissionRate.max],
        overdueAmount: [data.overdueAmount.min, data.overdueAmount.max],
        payStatus: data.payStatus,
        overdueDays: [data.overdueDays.min, data.overdueDays.max],
        delegationDate: [FilterService.dateRanageFormat(data.delegationDate).start, FilterService.dateRanageFormat(data.delegationDate).end],
        closeDate: [FilterService.dateRanageFormat(data.closeDate).start, FilterService.dateRanageFormat(data.closeDate).end]
      },
      page: page
    })
  }
  /**
   * 内催待分配预览
   */
  distributePreview(data) {
    return this.netService.send({
      server: businessService.caseInfoController.distributePreview,
      data: data
    })
  }
  /**
   * 内催待分配案件分配
   */
  @Debounce()
  distributeCaseInfo(data) {
    return this.netService.send({
      server: businessService.caseInfoController.distributeCaseInfo,
      data: data
    })
  }
  /**
   * 案件跟进记录
 */
  getCaseInfoFollowRecord(data, page, sort?) {
    return this.netService.send({
      server: businessService.caseInfoController.getCaseInfoFollowRecord,
      data: {
        operatorTime: [FilterService.dateRanageFormat(data.operatorTime).start, FilterService.dateRanageFormat(data.operatorTime).end],
        caseNumber: data.caseNumber,
        type: data.type,
        collectionFeedback: data.collectionFeedback
      },
      page,
      sort
    })
  }
  /**
   * 导出跟进记录(单案件)
   */
  exportFollowRecord(caseNumber) {
    return this.netService.send({
      server: businessService.caseInfoController.exportFollowRecord,
      data: {
        caseNumber
      }
    })
  }
  /**
   */
  innerStrategyDistribute(data) {
    return this.netService.send({
      server: businessService.caseInfoController.innerStrategyDistribute,
      data: {
        caseIds: data.caseIds
      }
    })
  }
  /**
   * 撤销案件(单条)
   */
  revertCaseInfoDistribute(batchNumber) {
    return this.netService.send({
      server: businessService.caseInfoController.revertCaseInfoDistribute,
      data: {
        batchNumber: batchNumber
      }
    })
  }
  /**
   * 撤销案件(多条)
   */
  revertCaseInfoDistributeByCaseId(data) {
    return this.netService.send({
      server: businessService.caseInfoController.revertCaseInfoDistributeByCaseId,
      data: {
        ids: data
      }
    })
  }
  /**
   * 提醒已还款案件列表查询(内催已结案)
   */
  getInnerOverCase(data, page) {
    return this.netService.send({
      server: businessService.caseInfoController.getInnerOverCase,
      data: {
        'personalInfo.name': data.name,
        'personalInfo.mobileNo': data.mobileNo,
        'personalInfo.idCard': data.idCard,
        principalId: data.principalId,
        batchNumber: data.batchNumber,
        overdueAmount: [data.overdueAmount.min, data.overdueAmount.max],
        payStatus: data.payStatus,
        overdueDays: [data.overdueDays.min, data.overdueDays.max],
        delegationDate: [FilterService.dateRanageFormat(data.delegationDate).start, FilterService.dateRanageFormat(data.delegationDate).end],
        closeDate: [FilterService.dateRanageFormat(data.closeDate).start, FilterService.dateRanageFormat(data.closeDate).end]
      },
      page: page
    })
  }
  /**
   * 内催回收案件
   */
  findAllCaseInfoReturn(data, page) {
    return this.netService.send({
      server: businessService.caseInfoController.findAllCaseInfoReturn,
      data: {
        'caseId.personalInfo.name': data.name,
        'caseId.personalInfo.mobileNo': data.mobileNo,
        'personalInfo.idCard': data.idCard,
        'caseId.batchNumber': data.batchNumber,
        'caseId.overdueAmount': [data.overdueAmount.min, data.overdueAmount.max],
        'caseId.payStatus': data.payStatus,
        'caseId.overdueDays': [data.overdueDays.min, data.overdueDays.max],
        operatorTime: [FilterService.dateRanageFormat(data.operatorTime).start, FilterService.dateRanageFormat(data.operatorTime).end]
      },
      page: page
    })
  }
  /**
   * 案件再分配
   */
  @Debounce()
  distributeCeaseInfoAgain(data) {
    return this.netService.send({
      server: businessService.caseInfoController.distributeCeaseInfoAgain,
      data: data
    })
  }

  /**
   * 电催小流转池
   */
  electricSmallCirculation(page, data) {
    return this.netService.send({
      server: businessService.caseInfoController.electricSmallCirculation,
      data: {
        companyCode: data.companyCode,
        'personalInfo.name': data.personalName,
        'personalInfo.mobileNo': data.personalPhone,
        orderId: data.orderId,
        overdueAmount: [data.amtRange.min, data.amtRange.max],
        overdueDays: [data.overdueDays.min, data.overdueDays.max],
        'personalInfo.idCard': data.idCard,
        batchNumber: data.batchNumber,
        "principalId.id": data.principalId,
        collectionStatus: data.collectionStatus,
        caseType: data.caseType
      },
      page: page
    })
  }
  /**
   * 电催强制流转池
   */
  electricForceCirculation(page, data) {
    return this.netService.send({
      server: businessService.caseInfoController.electricForceCirculation,
      data: {
        companyCode: data.companyCode,
        'personalInfo.name': data.personalName,
        'personalInfo.mobileNo': data.personalPhone,
        orderId: data.orderId,
        overdueAmount: [data.amtRange.min, data.amtRange.max],
        overdueDays: [data.overdueDays.min, data.overdueDays.max],
        'personalInfo.idCard': data.idCard,
        batchNumber: data.batchNumber,
        "principalId.id": data.principalId,
        collectionStatus: data.collectionStatus,
        caseType: data.caseType
      },
      page: page
    })
  }
  /**
   * 获取所有批次号
   */
  getAllBatchNumber() {
    return this.netService.send({
      server: businessService.caseInfoController.getAllBatchNumber
    })
  }
  /**
  * 外访小流转池
  */
  outSmallCirculation(page, data) {
    return this.netService.send({
      server: businessService.caseInfoController.outSmallCirculation,
      data: {
        companyCode: data.companyCode,
        'personalInfo.name': data.personalName,
        'personalInfo.mobileNo': data.personalPhone,
        orderId: data.orderId,
        overdueAmount: [data.amtRange.min, data.amtRange.max],
        overdueDays: [data.overdueDays.min, data.overdueDays.max],
        'personalInfo.idCard': data.idCard,
        collectionStatus: data.collectionStatus,
        caseType: data.caseType,
        principalId: data.principalId,
        'area.id': data.areaId,
      },
      page: page
    })
  }
  /**
   * 外访强制流转池
   */
  outForceCirculation(page, data) {
    return this.netService.send({
      server: businessService.caseInfoController.outForceCirculation,
      data: {
        companyCode: data.companyCode,
        'personalInfo.name': data.personalName,
        'personalInfo.mobileNo': data.personalPhone,
        orderId: data.orderId,
        overdueAmount: [data.amtRange.min, data.amtRange.max],
        overdueDays: [data.overdueDays.min, data.overdueDays.max],
        'personalInfo.idCard': data.idCard,
        collectionStatus: data.collectionStatus,
        caseType: data.caseType,
        principalId: data.principalId,
        'area.id': data.areaId,
      },
      page: page
    })
  }
  /**
   * 获取案件备注信息
   */
  getCaseInfoRemark(data, page, sort) {
    return this.netService.send({
      server: businessService.caseInfoController.getCaseInfoRemark,
      data: data,
      page: page,
      sort
    })
  }
  /**
   * 获取共债案件数量
   * @param data
   * @param page
   */
  getCommonCaseCount(id) {
    return this.netService.send({
      server: businessService.caseInfoController.getCommonCaseCount,
      data: {
        caseId: id
      }
    })
  }
  /**
   * 获取共债案件列表
   * @param data
   * @param page
   */
  queryCaseInfoList(data, page) {
    return this.netService.send({
      server: businessService.caseInfoController.queryCaseInfoList,
      data: {
        id: data.id,
        companyCode: data.companyCode
      },
      page
    })
  }
  /**
   * 分配案件时判断所选用户是否有催收类型
   */
  checkUser(data) {
    return this.netService.send({
      server: businessService.caseInfoController.checkUser,
      data: {
        userIds: data,
      }
    })
  }
  /**
   * 内催待分配案件评分
   */
  updateInnerWaitCollScore() {
    return this.netService.send({
      server: businessService.caseInfoController.updateInnerWaitCollScore
    })
  }

  /**
   * 逾期信息查询
   */
  getOverdueInfo(data) {
    return this.netService.send({
      server: businessService.caseInfoController.getOverdueInfo,
      data: {
        id: data
      }
    })
  }

}
