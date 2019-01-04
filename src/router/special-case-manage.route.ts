const SpecialUndistributedCase = () => import('~/pages/special-case-manage/special-undistributed-case.vue')
const SpecialInTheCollection = () => import('~/pages/special-case-manage/special-in-the-collection.vue')
const SpecialReturnC = () => import('~/pages/special-case-manage/special-return-c.vue')
const SpecialHandledCase = () => import('~/pages/special-case-manage/special-handled-case.vue')

export default [
  {
    path: '/special-case-manage/special-undistributed-case',
    name: 'special-undistributed-case',
    component: SpecialUndistributedCase
  },
  {
    path: '/special-case-manage/special-in-the-collection',
    name: 'special-in-the-collection',
    component: SpecialInTheCollection
  },
  {
    path: '/special-case-manage/special-return-c',
    name: 'special-return-c',
    component: SpecialReturnC
  },
  {
    path: '/special-case-manage/special-handled-case',
    name: 'special-handled-case',
    component: SpecialHandledCase
  }
]