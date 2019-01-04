const CompanyManage = () => import('~/pages/system-manage/company-manage.vue')
const RoleManage = () => import('~/pages/system-manage/role-manage.vue')
const UserManage = () => import('~/pages/system-manage/user-manage.vue')
const VersionManage = () => import('~/pages/system-manage/version-manage.vue')
const BatchManage = () => import('~/pages/system-manage/batch-manage.vue')
const SystemParameterManage = () => import('~/pages/system-manage/system-parameter-manage.vue')
const SystemLog = () => import('~/pages/system-manage/system-log.vue')
const OnthlyReturnAmountManagement = () => import('~/pages/system-manage/onthly-return-amount-management.vue')
const MessageBatchPush = () => import('~/pages/system-manage/message-batch-push.vue')
const SystemBackup = () => import('~/pages/system-manage/system-backup.vue')
const WorkFlowManage = () => import('~/pages/system-manage/work-flow-manage.vue')

export default [
  {
    // 公司管理
    path: '/system-manage/company-manage',
    name: 'company-manage',
    component: CompanyManage
  }, {
    // 角色管理
    path: '/system-manage/role-manage',
    name: 'role-manage',
    component: RoleManage
  }, {
    // 用户机构管理
    path: '/system-manage/user-manage',
    name: 'user-manage',
    component: UserManage
  }, {
    // 系统参数管理
    path: '/system-manage/version-control',
    name: 'version-control',
    component: VersionManage
  }, {
    // 批量管理
    path: '/system-manage/batch-manage',
    name: 'batch-manage',
    component: BatchManage
  }, {
    // 系统参数管理
    path: '/system-manage/system-parameter-manage',
    name: 'system-parameter-manage',
    component: SystemParameterManage
  }, {
    // 系统日志
    path: '/system-manage/system-log',
    name: 'system-log',
    component: SystemLog
  }, {
    // 版本控制
    path: '/system-manage/version-manage',
    name: 'version-manage',
    component: VersionManage
  }, {
    // 催收员月任务管理
    path: '/system-manage/onthly-return-amount-management',
    name: 'onthly-return-amount-management',
    component: OnthlyReturnAmountManagement
  }, {
    // 消息推送
    path: '/system-manage/message-batch-push',
    name: 'message-batch-push',
    component: MessageBatchPush
  }, {
    // 系统备份
    path: '/system-manage/system-backup',
    name: 'system-backup',
    component: SystemBackup
  }, {
    // 流程配置
    path: '/system-manage/work-flow-manage',
    name: 'work-flow-manage',
    component: WorkFlowManage
  }
]
