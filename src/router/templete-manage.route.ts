
const TemplateConfig = () => import('~/pages/templete-manage/template-config.vue')
const LetterTemplate = () => import('~/pages/templete-manage/letter-template.vue')
const ExcelTemplate = () => import('~/pages/templete-manage/excel-template.vue')
const ImportTemplate = () => import('~/pages/templete-manage/import-template.vue')

export default [
  {
    path: '/templete-manage/template-config',
    name: 'template-config',
    component: TemplateConfig
  }, {
    path: '/templete-manage/letter-template',
    name: 'letter-template',
    component: LetterTemplate
  }, {
    path: '/templete-manage/excel-template',
    name: 'excel-template',
    component: ExcelTemplate
  }, {
    path: '/templete-manage/import-template',
    name: 'import-template',
    component: ImportTemplate
  }
]
