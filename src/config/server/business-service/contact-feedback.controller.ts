import { requestType } from '~/config/enum.config'

const SERVICE = 'business-service'
const CONTROLLER = 'contactFeedbackController'

export default {
    /**
     * 获取定义为失联案件的相关信息
     */
    invalidContactCase: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'invalidContactCase',
        type: requestType.Get
    },
    /**
     * 失联案件导出
     */
    invalidContactCaseExport: {
        service: SERVICE,
        controller: CONTROLLER,
        action: 'invalidContactCaseExport',
        type: requestType.Get
    }
}
