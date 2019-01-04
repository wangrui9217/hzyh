import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class CaseAssistService {
    @Inject(NetService)
    private netService: NetService

    /**
     * 协催案件留案操作
     */
    @Debounce()
    leaveCaseAssist(data?) {
        return this.netService.send({
            server: businessService.caseAssistController.leaveCaseAssist,
            data: data
        })
    }
    /**
     * 协催案件取消留案操作
     */
    cancelLeaveCaseAssist(data?) {
        return this.netService.send({
            server: businessService.caseAssistController.cancelLeaveCaseAssist,
            data: data
        })
    }
    /**
     * 结束协催
     */
    closeCaseAssist(data) {
        return this.netService.send({
            server: businessService.caseAssistController.closeCaseAssist,
            data: data
        })
    }
    /**
     * 获取可分配催收员
     */
    getBatchInfo(data?) {
        return this.netService.send({
            server: businessService.caseAssistController.getBatchInfo,
            data
        })
    }
    /**
     * 协催案件分配确定
     */
    @Debounce()
    assignCaseAssist(data) {
        return this.netService.send({
            server: businessService.caseAssistController.assignCaseAssist,
            data: data
        })
    }
    /**
     * 协催案件批量分配
     */
    @Debounce()
    batchCaseAssist(data) {
        return this.netService.send({
            server: businessService.caseAssistController.batchCaseAssist,
            data: data
        })
    }
    /**
     * 协催案件标色
     */
    assistCaseMarkColor(data) {
        return this.netService.send({
            server: businessService.caseAssistController.assistCaseMarkColor,
            data: data
        })
    }
    /**
     * 协催页面还款操作
     */
    @Debounce()
    doAssistPay(data) {
        return this.netService.send({
            server: businessService.caseAssistController.doAssistPay,
            data
        })
    }
    /**
     * 协催案件页面添加跟进记录
     */
    @Debounce()
    saveFollowupRecord(data) {
        return this.netService.send({
            server: businessService.caseAssistController.saveFollowupRecord,
            data
        })
    }
    /**
     * 查询还款申请/记录
     */
    findAssistCasePayRecord(data, page, sort) {
        return this.netService.send({
            server: businessService.caseAssistController.findAssistCasePayRecord,
            data: data,
            page: page,
            sort: sort
        })
    }
    /**
     * 协催页面还款撤回
     */
    assistWithdraw(data) {
        return this.netService.send({
            server: businessService.caseAssistController.assistWithdraw,
            data: data
        })
    }
}
