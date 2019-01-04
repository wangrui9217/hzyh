export class PageService {
  public pageIndex: number;
  public total: number;
  public totalPage: number
  public pageSize: number;
  public loading: boolean;
  public pageSizeOpts: Array<number>
  public layout: string

  constructor() {
    this.total = 0
    this.pageIndex = 1
    this.pageSize = 10
    this.loading = false
    this.pageSizeOpts = [10, 30, 50, 100, 500]
    this.layout = 'total, sizes, prev, pager, next, jumper'
  }

  /**
   * 获取分页配置信息
   */
  getConfig() {
    return {
      page: this.pageIndex - 1,
      size: this.pageSize
    }
  }

  /**
   * 更新分页配置信息
   * @param param
   */
  update({ totalElements, totalPages }) {
    this.total = parseInt(totalElements)
    this.totalPage = parseInt(totalPages)
  }

  /**
   * 重置分页数据
   */
  reset(){
    this.total = 0
    this.pageIndex = 1
    this.loading = false
  }
}
