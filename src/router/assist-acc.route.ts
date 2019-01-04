
const AssistCase = () => import('~/pages/assist-acc/assist-case.vue')
const AssistHandledCase = () => import('~/pages/assist-acc/assist-handled-case.vue')

export default [
  {
    path: '/assist-acc/assist-case',
    name: 'assist-case',
    component: AssistCase
  }, {
    path: '/assist-acc/assist-handled-case',
    name: 'assist-handled-case',
    component: AssistHandledCase
  }
]
