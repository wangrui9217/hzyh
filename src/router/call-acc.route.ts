
const CallCase = () => import('~/pages/call-acc/call-case.vue')
const CallHandledCase = () => import('~/pages/call-acc/call-handled-case.vue')
const WaitCollection = () => import('~/pages/call-acc/wait-collection.vue')
const InTheCollection = () => import('~/pages/call-acc/in-the-collection.vue')
const ReturnCCcase = () => import('~/pages/call-acc/return-c-case.vue')

export default [
  {
    path: '/call-acc/call-case',
    name: 'call-case',
    component: CallCase
  }, {
    path: '/call-acc/wait-collection',
    name: 'wait-collection',
    component: WaitCollection
  }, {
    path: '/call-acc/in-the-collection',
    name: 'in-the-collection',
    component: InTheCollection
  }, {
    path: '/call-acc/return-c-case',
    name: 'return-c-case',
    component: ReturnCCcase
  }, {
    path: '/call-acc/call-handled-case',
    name: 'call-handled-case',
    component: CallHandledCase
  }
]
