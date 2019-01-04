const CallSmallFlow = () => import('~/pages/flow-manage/call-small-flow.vue')
const CallForceFlow = () => import('~/pages/flow-manage/call-force-flow.vue')
const VisitSmallFlow = () => import('~/pages/flow-manage/visit-small-flow.vue')
const VisitForceFlow = () => import('~/pages/flow-manage/visit-force-flow.vue')

export default [
  {
    path: '/flow-manage/call-small-flow',
    name: 'call-small-flow',
    component: CallSmallFlow
  }, {
    path: '/flow-manage/call-force-flow',
    name: 'call-force-flow',
    component: CallForceFlow
  }, {
    path: '/flow-manage/visit-small-flow',
    name: 'visit-small-flow',
    component: VisitSmallFlow
  }, {
    path: '/flow-manage/visit-force-flow',
    name: 'visit-force-flow',
    component: VisitForceFlow
  }
]
