import caseInfoInquiryController from './case-info-inquiry.controller'
import caseInfoDistributeController from './case-info-distribute.controller'
import exportCaseInfoController from './export-case-info.controller'
import CaseInfoReportController from './case-info-report.controller'
import exportFollowupController from './export-followup.controller'
import queryOutsourcePoolController from './query-outsource-pool.controller'
import exportOutsourceFollowupController from './export-outsource-followup.controller'
import strateDataManualController from './strate-data-manual.controller'
import homePageController from './home-page.controller'
import reportController from './report.controller'
import distributionController from './distribution.controller'
import queryUserController from './query-user.controller'

export const reportService = {
  strateDataManualController,
  queryOutsourcePoolController,
  caseInfoInquiryController,
  caseInfoDistributeController,
  exportCaseInfoController,
  CaseInfoReportController,
  exportFollowupController,
  exportOutsourceFollowupController,
  homePageController,
  reportController,
  distributionController,
  queryUserController
}
