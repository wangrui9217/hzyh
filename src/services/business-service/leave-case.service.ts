import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
import { FilterService } from '~/utils/filter.service';

export class LeaveCaseService {

    @Inject(NetService)
    private netService: NetService

    /**
     * 获取委外留案审批案件
     */
    getLeaveCaseInfoAll(data, page?) {
        return this.netService.send({
            server: businessService.leaveCaseController.getLeaveCaseInfoAll,
            data,
            page
        })
    }
    /**
     * 委外留案审批
     */
    saveApprovaLeaveCase(data) {
        return this.netService.send({
            server: businessService.leaveCaseController.saveApprovaLeaveCase,
            data
        })
    }
    /**
     * 委外留案申请
     */
    @Debounce()
    leaveCaseApply(data) {
        return this.netService.send({
            server: businessService.leaveCaseController.leaveCaseApply,
            data: {
                taskId: data.taskId,
                leftDate: FilterService.dateTimeFormat(data.leftDate),
                leaveReason: data.leaveReason,
                caseIdList: data.caseIdList
            }
        })
    }
}