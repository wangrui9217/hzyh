<template>
  <section class="page remind-distributed">
    <data-form :model="undistributedModel" @onSearch="refreshData" :rules="inrushRule">
      <template slot="default-input">
        <el-form-item label="客户姓名" prop="personalName" v-auth="1384">
          <el-input v-model="undistributedModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="1385">
          <el-input v-model="undistributedModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="逾期金额" prop="amtRange" v-auth="1387">
          <number-range v-model="undistributedModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="1386">
          <number-range v-model="undistributedModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" v-auth="1389">
          <el-input v-model="undistributedModel.idCard"></el-input>
        </el-form-item>
        <el-form-item label="门店" prop="shopDeptId" v-auth="1390">
          <el-select v-model="undistributedModel.shopDeptId" placeholder="请选择" clearable>
            <el-option v-for="{name,id} in storeList" :key="id" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="caseAllotClick" v-auth="1391">手动分案</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="undistributedDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号 " :min-width="$helper.getColumnWidth(8)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号 " :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="city" label="城市" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="compId" label="门店" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="shopDeptName" label="业务部门" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="employeeName" label="业务经理" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="busDeptName" label="催收部门" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数 " :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmt" label="逾期金额(元) " align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">{{scope.row.overdueAmt|toThousands}}</template>
        </el-table-column>
        <el-table-column label="案件详情" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button @click="checkCaseInfo(scope.row)" type="text" v-auth="1392">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="detailObj.caseId"></case-detail>
    </el-dialog>
    <!--选择催收机构或催收员-->
    <el-dialog title="请选择催收员" :center="true" :visible.sync="dialog.caseAllot" width="80%" @open="$nextTick(()=>{$refs['case-allot'].refresh()})">
      <case-allot ref="case-allot" @close="dialog.caseAllot = false" @user="dialog.userAllocate=true" @org="dialog.orgAllocate=true"></case-allot>
    </el-dialog>
    <!--分配给催收员-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.userAllocate" @open="userOpen" width="70%">
      <user-allocate ref="user-allocate" :selectedCase="selectionList" @preStep="dialog.userAllocate=false" @cancel="dialog.userAllocate=false;dialog.caseAllot =false" @success="dialog.userAllocate=false;dialog.caseAllot =false;refreshData()"></user-allocate>
    </el-dialog>
    <!--分配给催收机构-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.orgAllocate" @open="orgOpen" width="70%">
      <org-allocate ref="org-allocate" :selectedCase="selectionList" @preStep="dialog.orgAllocate=false" @cancel="dialog.orgAllocate=false;dialog.caseAllot =false" @success="dialog.orgAllocate=false;dialog.caseAllot =false;refreshData()"></org-allocate>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { CaseInfoReportService } from "~/services/report-service/case-info-report.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import CaseAllot from "~/components/case-info/case-allot.vue";
import UserAllocate from "~/components/case-info/case-allot/user-allocate.vue";
import OrgAllocate from "~/components/case-info/case-allot/org-allocate.vue";
import NumberRange from "~/components/common/number-range.vue";

@Auth(1115)
@Layout('workspace')
@Component({
  components: {
    DataForm,
    DataBox,
    CaseDetail,
    CaseAllot,
    UserAllocate,
    OrgAllocate,
    NumberRange
  }
})
export default class RemindDistributed extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoReportService) private caseInfoReportService: CaseInfoReportService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @State storeList: any;

  private undistributedModel: any = {};
  private undistributedDataSet: Array<any> = [];
  private selectionList: any = [];
  private dialog: any = {};
  private detailObj: any = {};
  // 表单验证规则
  private inrushRule:any = {};
  
  created() {
    this.dialog = {
      detail: false,
      caseAllot: false,
      userAllocate: false,
      orgAllocate: false
    }
    this.undistributedModel = {
      companyCode: '',
      personalName: '',
      mobileNo: '',
      principalId: '',
      orderId: '',
      // leftDueDays: '', //即将到期天数
      'parentAreaId': '',
      'areaId': '',
      amtRange: {
        min: "",
        max: ""
      },
      payStatus: '',
      overdueDays: {
        min: "",
        max: ""
      },
      delegationDate: '',
      closeDate: '',
      idCard: '',
      overDuePayStatus: 'M0',
      shopDeptId: ''
    }

    this.inrushRule = {
      mobileNo: { validator: this.$validator.phoneNumber, trigger: "blur" },
      idCard: { validator: this.$validator.idCard, trigger: "blur" }
    };
  }
  mounted() {
    this.undistributedModel.companyCode = this.userData.companyCode
    this.refreshData()
  }
  refreshData() {
    this.caseInfoReportService.queryWaitDistributed(this.undistributedModel, this.pageService).subscribe(
      data => this.undistributedDataSet = data,
      err => this.$message.error(err.msg)
    )
  }
  /**
   * 查看案件详情
   */
  checkCaseInfo(row) {
    this.dialog.detail = true;
    this.detailObj = row;
  }
  /**
   * 手动分案
   */
  caseAllotClick() {
    if (this.selectionList.length === 0) {
      this.$message('请选择分案的案件!')
      return;
    }
    this.dialog.caseAllot = true;
  }
  /**
   * 分配给催收员open
   */
  userOpen() {
    this.$nextTick(() => {
      let userAllocate: any = this.$refs['user-allocate'];
      userAllocate.refreshData()
    })
  }
  /**
   * 分配给机构
   */
  orgOpen() {
    this.$nextTick(() => {
      let orgAllocate: any = this.$refs['org-allocate'];
      orgAllocate.refreshData(this.selectionList)
    })
  }
  /**
   * 策略分案
   */
  strategicClick() {
    let caseIds = this.selectionList.map(v => {
      return v.caseId
    })
    this.caseInfoService.innerStrategyDistribute(caseIds).subscribe(
      data => this.$message.success("分配成功"),
      err => this.$message.error(err.msg)
    );
  }
}

</script>

<style lang="less">

</style>
