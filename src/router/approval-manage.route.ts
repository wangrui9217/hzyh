
const CostReduce = () => import('~/pages/approval-manage/cost-reduce.vue')
const RepairReview = () => import('~/pages/approval-manage/repair-review.vue')
const VerifiApproval = () => import('~/pages/approval-manage/verifi-approval.vue')
const CallAssistApplication = () => import('~/pages/approval-manage/call-assist-application.vue')
const AssistApplication = () => import('~/pages/approval-manage/assist-application.vue')
const AccFlowApproval = () => import('~/pages/approval-manage/acc-flow-approval.vue')
const VisitFlowApproval = () => import('~/pages/approval-manage/visit-flow-approval.vue')
const OutsourceLeaveCaseApproval = () => import('~/pages/approval-manage/outsource-leave-case-approval.vue')
const CaseTransfromApproval = () => import('~/pages/approval-manage/case-transfrom-approval.vue')

export default [
  {
    //费用减免审批
    path: '/approval-manage/cost-reduce',
    name: 'cost-reduce',
    component: CostReduce
  }, {
    // 还款审核
    path: '/approval-manage/repair-review',
    name: 'repair-review',
    component: RepairReview
  }, {
    // 核销案件审批
    path: '/approval-manage/verifi-approval',
    name: 'verifi-approval',
    component: VerifiApproval
  }, {
    // 电催协催申请审批
    path: '/approval-manage/call-assist-application',
    name: 'call-assist-application',
    component: CallAssistApplication
  }, {
    // 外访协催申请审批
    path: '/approval-manage/assist-application',
    name: 'assist-application',
    component: AssistApplication
  }, {
    // 电催提前流转审批
    path: '/approval-manage/acc-flow-approval',
    name: 'acc-flow-approval',
    component: AccFlowApproval
  }, {
    // 外访提前流转审批
    path: '/approval-manage/visit-flow-approval',
    name: 'visit-flow-approval',
    component: VisitFlowApproval
  }, 
  {
    // 委外留案审批
    path: '/approval-manage/outsource-leave-case-approval',
    name: 'outsource-leave-case-approval',
    component: OutsourceLeaveCaseApproval
  }, 
  {
    // 案件流转审批
    path: '/approval-manage/case-transfrom-approval',
    name: 'case-transfrom-approval',
    component: CaseTransfromApproval
  }
]
