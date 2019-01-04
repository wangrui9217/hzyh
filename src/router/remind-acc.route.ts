
const RemindCase = () => import('~/pages/remind-acc/remind-case.vue')
const RemindRepay = () => import('~/pages/remind-acc/remind-repay.vue')
const RemindDistributed = () => import('~/pages/remind-acc/remind-distributed.vue')
const RemindStripping = () => import('~/pages/remind-acc/remind-stripping.vue')

export default [
    {
        path: '/remind-acc/remind-distributed',
        name: 'remind-distributed',
        component: RemindDistributed
    },
    {
        path: '/remind-acc/remind-case',
        name: 'remind-case',
        component: RemindCase
    }, {
        path: '/remind-acc/remind-repay',
        name: 'remind-repay',
        component: RemindRepay
    }, {
        path: '/remind-acc/remind-stripping',
        name: 'remind-stripping',
        component: RemindStripping
    }
]
