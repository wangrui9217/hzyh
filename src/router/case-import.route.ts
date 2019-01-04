
const ClientManage = () => import('~/pages/case-import/client-manage.vue')
const AbnormalCase = () => import('~/pages/case-import/abnormal-case.vue')
const UndistributedCase = () => import('~/pages/case-import/undistributed-case.vue')
const IntroductionCase = () =>import('~/pages/case-import/introduction-case.vue')

export default [
  {
    path: '/case-import/client-manage',
    name: 'client-manage',
    component: ClientManage
  }, {
    path: '/case-import/abnormal-case',
    name: 'abnormal-case',
    component: AbnormalCase
  }, {
    path: '/case-import/undistributed-case',
    name: 'undistributed-case',
    component: UndistributedCase
  }, {
    path: '/case-import/introduction-case',
    name: 'introduction-case',
    component: IntroductionCase
  }
]
