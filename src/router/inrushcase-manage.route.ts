const InrushUndistributedCase = () => import('~/pages/inrushcase-manage/inrush-undistributed-case.vue')
const InrushCaseInCollection = () => import('~/pages/inrushcase-manage/inrush-case-in-collection.vue')
const InrushClosedCase = () => import('~/pages/inrushcase-manage/inrush-closed-case.vue')
const InrushCaseReturnC = () => import('~/pages/inrushcase-manage/inrush-case-return-c.vue')

export default [
  {
    path: '/inrushcase-manage/inrush-undistributed-case',
    name: 'inrush-undistributed-case',
    title: '待分配案件',
    component: InrushUndistributedCase
  }, {
    path: '/inrushcase-manage/inrush-case-in-collection',
    name: 'inrush-case-in-collection',
    title: '催收中案件',
    component: InrushCaseInCollection
  }, {
    path: '/inrushcase-manage/inrush-case-return-c',
    name: 'inrush-case-return-c',
    title: '归C案件',
    component: InrushCaseReturnC
  },{
    path: '/inrushcase-manage/inrush-closed-case',
    name: 'inrush-closed-case',
    title: '已结案案件',
    component: InrushClosedCase
  }
]
