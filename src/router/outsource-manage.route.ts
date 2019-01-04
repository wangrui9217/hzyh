const UndistributedCase = () => import('~/pages/outsource-manage/undistributed-case.vue')
const CaseInCollection = () => import('~/pages/outsource-manage/case-in-collection.vue')
const ClosedCase = () => import('~/pages/outsource-manage/closed-case.vue')
const CaseInRecovery = () => import('~/pages/outsource-manage/case-in-recovery.vue')
const OutsourceAcc = () => import('~/pages/outsource-manage/outsource-acc.vue')
const OutsourceAccountsImport = () => import('~/pages/outsource-manage/outsource-accounts-import.vue')
const OutsourceReconciliationTable = () => import('~/pages/outsource-manage/outsource-reconciliation-table.vue')
const OutCommissionCalculateLatReport = () => import('~/pages/outsource-manage/out-commission-calculate-lat-report.vue')
const OutsourceReturnedC = () => import('~/pages/outsource-manage/outsource-returned-c.vue')
const OutsourcePredistribution = () => import('~/pages/outsource-manage/outsource-predistribution.vue')

export default [
  {
    path: '/outsource-manage/outsource-acc',
    name: 'outsource-acc',
    title: '受托方管理',
    component: OutsourceAcc
  }, {
    path: '/outsource-manage/undistributed-case',
    name: 'outsource-undistributed-case',
    title: '待分配案件',
    component: UndistributedCase
  }, {
    path: '/outsource-manage/case-in-collection',
    name: 'case-in-collection',
    title: '全部案件',
    component: CaseInCollection
  }, {
    path: '/outsource-manage/outsource-returned-c',
    name: 'outsource-returned-c',
    title: '已归C案件',
    component: OutsourceReturnedC
  }, {
    path: '/outsource-manage/closed-case',
    name: 'closed-case',
    title: '已结案案件',
    component: ClosedCase
  }, {
    path: '/outsource-manage/case-in-recovery',
    name: 'case-in-recovery',
    title: '回收案件',
    component: CaseInRecovery
  }, {
    path: '/outsource-manage/outsource-accounts-import',
    name: 'outsource-accounts-import',
    title: '委外案件账目导入',
    component: OutsourceAccountsImport
  }, {
    path: '/outsource-manage/outsource-reconciliation-table',
    name: 'outsource-reconciliation-table',
    title: '委外对账表',
    component: OutsourceReconciliationTable
  }, {
    path: '/outsource-manage/out-commission-calculate-lat-report',
    name: 'out-commission-calculate-lat-report',
    title: '受托方佣金报表',
    component: OutCommissionCalculateLatReport
  }, {
    path: '/outsource-manage/outsource-predistribution',
    name: 'outsource-predistribution',
    title: '委外预分案',
    component: OutsourcePredistribution
  }
]
