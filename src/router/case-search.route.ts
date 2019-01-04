
const SearchCase = () => import('~/pages/case-search/search-case.vue')
const CustomerExport = () => import('~/pages/case-search/customer-export.vue')
const FirstLostQuery = () => import('~/pages/case-search/first-lost-query.vue')
const CaseCirculationRecord = () => import('~/pages/case-search/case-circulation-record.vue')
const SearchHistoryReminders = () => import('~/pages/case-search/search-history-reminders.vue')


export default [
  {
    path: '/case-search/search-case',
    name: 'search-case',
    component: SearchCase
  }, {
    path: '/case-search/customer-export',
    name: 'customer-export',
    component: CustomerExport
  }, {
    path: '/case-search/first-lost-query',
    name: 'first-lost-query',
    component: FirstLostQuery
  }, {
    path: '/case-search/case-circulation-record',
    name: 'case-circulation-record',
    component: CaseCirculationRecord
  }, {
    path: '/case-search/search-history-reminders',
    name: 'search-history-reminders',
    component: SearchHistoryReminders
  }


  // , {
  //   path: '/case-search/followup-export',
  //   name: 'followup-export',
  //   component: FollowupExport
  // }
]
