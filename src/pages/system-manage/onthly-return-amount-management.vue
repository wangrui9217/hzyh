<template>
  <section class="page onthly-return-amount-management">
    <data-form :model="onthlyModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="userName" v-auth="5536">
          <el-input type="text" v-model="onthlyModel.userName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName" v-auth="5537">
          <el-input v-model="onthlyModel.realName"></el-input>
        </el-form-item>
        <el-form-item label="年份" prop="year"  v-auth="5538">
          <el-input v-model="onthlyModel.year" :maxlength="4" :min="1" type="number" @blur="checkYear"></el-input>
        </el-form-item>
        <el-form-item label="月份" prop="month" v-auth="5539">
          <el-input v-model="onthlyModel.month" :maxlength="2" :min="1" :max="12" type="number" @blur="checkMonth"></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportClick" v-auth="5540">导入</el-button>
        <el-button @click="deleteClick" v-auth="5541">删除</el-button>
        <el-button @click="downloadClick" v-auth="5542">下载模板</el-button>
      </template>
    </data-form>
    <data-box @onPageChange="refreshData" :data="onthlyDataSet" :page="pageService" :selectionList.sync="selectionList">
      <template slot="columns">
        <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="year" label="年份" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="month" label="月份" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="backCash" label="回款金额(元)" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.backCash | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110px">
          <template slot-scope="scope">
            <el-button @click="modifybuttonClick(scope)" type="text" v-auth="5543">修改</el-button>
            <el-button @click="deletebuttonClick(scope)" type="text" v-auth="5544">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--弹出框-->
    <el-dialog title="月度回款金额模板导入" :visible.sync="dialog.MonthReturnAmtdialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <MonthReturnAmtTemplate @refresh="refreshDatabox" @close="dialog.MonthReturnAmtdialog=false" @errMsg="errMsgShow"></MonthReturnAmtTemplate>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialog.modifycaseclient" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @open="$nextTick(()=>$refs['modify'].refresh(modifyData))">
      <ModifyMonthReturnAmt @refresh="refreshDatabox" ref="modify" @close="dialog.modifycaseclient=false"></ModifyMonthReturnAmt>
    </el-dialog>
      <!--EXCEL错误弹出框-->
    <el-dialog title="Excel数据错误" :visible.sync="dialog.errMsgOpen" size="tiny" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <data-box :data="errMsgData"  class="text-center" :maxHeight="230">
        <template slot="columns">
          <el-table-column prop="errorMsg" label="错误提示" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
       </template>
      </data-box>
   </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter } from "vuex-class";
import { UserBackcashPlanService } from "../../services/business-service/user-backcash-plan.service";
import { PageService } from "~/utils/page.service";
import MonthReturnAmtTemplate from "~/components/system-manage/onthly-manage/month-return-amt-template.vue"
import ModifyMonthReturnAmt from "~/components/system-manage/onthly-manage/modify-month-return-amt.vue"
import { CommonService } from "~/utils/common.service";

@Auth(853)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox,
    MonthReturnAmtTemplate,
    ModifyMonthReturnAmt
  }
})
export default class OnthlyReturnAmountManagement extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(UserBackcashPlanService) private userBackcashPlanService: UserBackcashPlanService;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @State companyList: any;

  private onthlyModel: any = {
    paplUsernames: [],
    userName: '',
    realName: '',
    year: '',
    month: '',
    deptCodes: [],
    deptCode: '',
    companyCode: ''
  }
  private dialog: any = {
    MonthReturnAmtdialog: false,
    modifycaseclient: false,
    errMsgOpen: false
  }
  private onthlyDataSet = null
  private selectionList: Array<any> = []
  private modifyData: any = ''
  // 错误信息弹框
  private  errMsgData:any =  []
  /**
 * 考虑到非管理员不显示公司选择控件
 * get 操作的时候强制设置非管理员所在公司码
*/
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.onthlyModel.companyCode = this.userData.companyCode
    }
    return this.onthlyModel.companyCode
  }

  set companyCode(value) {
    this.onthlyModel.companyCode = value
  }
  /**
     * 页面激活
     */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }


  mounted() {
    this.refreshData()
  }
  refreshDatabox() {
    this.refreshData()
  }
  refreshData() {
    this.userBackcashPlanService
      .query(this.onthlyModel, this.pageService)
      .subscribe(data => {
        this.onthlyDataSet = data
      })
  }
  /**
   * 导入
   */
  exportClick() {
    this.dialog.MonthReturnAmtdialog = true
  }
  /**
   * 检查年份输入
   */
  checkYear() {
    if ((this.onthlyModel.year > 2200 || this.onthlyModel.year < 1900) && this.onthlyModel.year) {
      this.$message('请重新输入年份！')
      this.onthlyModel.year = ''
    }
  }
  /**
   * 检查月份输入
   */
  checkMonth() {
    if (this.onthlyModel.month > 12 || this.onthlyModel.month < 1 && this.onthlyModel.month) {
      this.$message('请重新输入月份！')
      this.onthlyModel.month = ''
    }
  }
  /**
   * 批量删除
   */
  deleteClick() {
    if (this.selectionList.length === 0) {
      this.$message('请选择要删除的数据！')
    } else {
      this.$confirm("您确定要删除选择的数据吗？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let idArr: any = this.selectionList.map(v => v.id)
        let codeArr: any = this.selectionList.map(v => v.companyCode)
        this.userBackcashPlanService
          .deleteManyUserBackcashPlan({
            ids: idArr,
            companyCode: codeArr
          })
          .subscribe(data => {
            this.$message.success('操作成功')
            this.refreshData()
          }, err => {
            this.$message.error(err.msg)
          })
      })
    }
  }
     /**
+      * execle错误信息弹出
+      */
    errMsgShow(data) {
      this.dialog.errMsgOpen = true
      console.log(123, data)
     this.$nextTick(()=>{
       this.errMsgData = data
      })
   }
  /**
   * 下载模板
   */
  downloadClick() {
    if(this.isSupperAdmin){
      if(this.onthlyModel.companyCode===""){
        this.$message('请选择公司名称')
        return
      }
    }
    this.userBackcashPlanService
      .downloadUserBackcashPlanExcelTemplate({ companyCode: this.onthlyModel.companyCode })
      .subscribe(
        data => {
          console.log(data, 'data')
          CommonService.downloadFile(data, '月度回款金额管理模板')
        },
        ({msg}) => this.$message.error(msg)
      )
  }
  /**
   * 单条删除
   */
  deletebuttonClick(scope) {
    this.$confirm('您确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.userBackcashPlanService
        .deleteUserBackcashPlan({ id: scope.row.id })
        .subscribe(data => {
          this.$message.success('操作成功')
          this.refreshData()
        }, err => {
          this.$message.error(err.msg)
        })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }
  /**
   * 修改
   */
  modifybuttonClick(scope) {
    this.modifyData = scope.row
    this.dialog.modifycaseclient = true
  }
}
</script >

<style scoped>

</style>
