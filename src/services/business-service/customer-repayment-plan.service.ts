import { businessService } from '~/config/server'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";

export class CustomerRepaymentPlanController {

    @Inject(NetService)
    private netService: NetService

    /**
     * 获取还款计划列表信息（执行页）
     */
    getCustomerRepaymentPlan(data) {
        return this.netService.send({
            server: businessService.customerRepaymentPlanController.getCustomerRepaymentPlan,
            data: data
        })
    }
}

