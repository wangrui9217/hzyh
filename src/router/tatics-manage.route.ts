const CaseTatics = () => import('~/pages/tatics-manage/case-tatics.vue')
const OutCommissionCalculateLat = () => import('~/pages/tatics-manage/out-commission-calculate-lat.vue')
const ObtainTatics = () => import('~/pages/tatics-manage/obtain-tatics.vue')

export default [
  {
    path: '/tatics-manage/case-tatics',
    name: 'case-tatics',
    component: CaseTatics
  }, {
    path: '/tatics-manage/out-commission-calculate-lat',
    name: 'out-commission-calculate-lat',
    component: OutCommissionCalculateLat
  }, {
    path: '/tatics-manage/obtain-tatics',
    name: 'obtain-tatics',
    component: ObtainTatics
  }
]
