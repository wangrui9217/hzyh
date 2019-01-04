const StopUndistributedCase = () => import('~/pages/stop-collection-manage/stop-undistributed-case.vue')
const StopInTheCollection = () => import('~/pages/stop-collection-manage/stop-in-the-collection.vue')
const StopReturnC = () => import('~/pages/stop-collection-manage/stop-return-c.vue')
const StopHandledCase = () => import('~/pages/stop-collection-manage/stop-handled-case.vue')


export default [
  {
    path: '/stop-collection-manage/stop-undistributed-case',
    name: 'stop-undistributed-case',
    component: StopUndistributedCase
  },
  {
    path: '/stop-collection-manage/stop-in-the-collection',
    name: 'stop-in-the-collection',
    component: StopInTheCollection
  },
  {
    path: '/stop-collection-manage/stop-return-c',
    name: 'stop-return-c',
    component: StopReturnC
  },
  {
    path: '/stop-collection-manage/stop-handled-case',
    name: 'stop-handled-case',
    component: StopHandledCase
  }
]