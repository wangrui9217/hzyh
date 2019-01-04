import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'customerRepaymentPlanController'

export default {
    /**
     *获取还款计划列表信息（执行页）
     */
    getCustomerRepaymentPlan: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'getCustomerRepaymentPlan',
        type: requestType.Get
    }
}
