<template>
  <section class="page search-case">
    <data-form :model="searchModel" @onSearch="refreshData" :page="pageService" :rules="searchRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personName" v-auth="5083">
          <el-input v-model="searchModel.personName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5084">
          <el-input v-model="searchModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>

        <el-form-item label="申请省份" prop="parentAreaId" v-auth="5085">
          <el-select v-model="searchModel.parentAreaId" clearable>
            <el-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请城市" prop="areaId" v-auth="5086">
          <el-select v-model="searchModel.areaId" clearable>
            <el-option v-for="{value,label} in this.searchModel.parentAreaId ? this.$city.getCityData({ level: 1, id: this.searchModel.parentAreaId}) : []" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5087">
          <el-select v-model="searchModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in getPrincipalList()" :key="index" :label="name" :value="id"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportClick" v-auth="5088">导出案件</el-button>
      </template>
    </data-form>
    <data-box :data="searchDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="借据号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" @click="openDetail(scope)">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo?scope.row.personalInfo.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo.mobileNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo.idCard}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principalId" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalId.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.area?scope.row.area.areaName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmt" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commissionRate" label="佣金比例(%)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.commissionRate|toPercent }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="delegationDate" label="委案日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.delegationDate|dateFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="closeDate" label="结案日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.closeDate|dateFormat}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="催收部门" :min-width="$helper.getColumnWidth(3)" prop="busDeptName" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.department ?scope.row.department.name:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cupoName" label="当前催收员" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.currentCollector?scope.row.currentCollector.realName: ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="催收反馈" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.followupBack===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt | toThousands }}元</p>
              <p class="text-left">还款日期: {{ scope.row.promiseTime }}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.followupBack|dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.followupBack|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="批注" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="dialog.remark=true,operateData=scope.row, remarkModel.remarks=''" type="text" v-auth="5089">添加批注</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="operateData.id"></case-detail>
    </el-dialog>
    <!--添加批注-->
    <el-dialog title="添加批注" :center="true" :visible.sync="dialog.remark" width="40%">
      <div>
        <el-form :model="remarkModel" ref="remarkForm" label-width="100px">
          <el-form-item prop="remarks" label-width="0px">
            <el-input type="textarea" v-model="remarkModel.remarks" resize="none"></el-input>
          </el-form-item>
        </el-form>
        <el-row align="center" style="margin-top:50px;text-align:center">
          <el-button @click="dialog.remark = false">取消</el-button>
          <el-button @click="confirm" :loading="remarkLoading">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { State, Getter, Mutation, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { ExportCaseInfoService } from "~/services/report-service/export-case-info.service";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import { CommonService } from "~/utils/common.service";

const accManageModule = namespace("acc-manage");
@Auth(372)
@Layout("workspace")
@Component({
  components: {
    CaseDetail,
    DataForm,
    DataBox
  }
})
export default class SearchCase extends Vue {
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(ExportCaseInfoService)
  private exportCaseInfoService: ExportCaseInfoService;
  @Dependencies(PageService) private pageService: PageService;

  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @State storeList: any;
  @Getter isSupperAdmin: boolean;
  @accManageModule.Mutation updateCaseInfo;


  // 表单验证规则
  private searchRule = {
    mobileNo: { validator: this.$validator.phoneNumber, trigger: "blur" }
  };
  private remarkModel: any = {
    remarks: ""
  };
  private searchModel: any = {
    companyCode: "",
    personName: "",
    mobileNo: "",
    principalId: "",
    parentAreaId: "",
    areaId: ""
  };
  private remarkLoading: any = false;
  private searchDataSet: Array<any> = [];
  private dialog: any = {
    detail: false,
    remark: false
  }
  private operateData: any = {}

  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
  */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.searchModel.companyCode = this.userData.companyCode
    }
    return this.searchModel.companyCode
  }

  set companyCode(value) {
    this.searchModel.companyCode = value
  }

  // 过滤公司数据
  getPrincipalList() {
    return this.principalList.filter(
      x => x.companyCode === this.searchModel.companyCode
    )
  }

  // /**
  //  * 案件导出
  //  */
  exportClick() {
    this.exportCaseInfoService.exportCaseInfo(this.searchModel).subscribe(
      data => {
        CommonService.downloadFile(data.body, "案件导出");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }

  openDetail(scope){
    this.operateData = scope.row;
    this.dialog.detail = true
  }
  /**
   * 添加批注
   */
  confirm() {
    if (!this.remarkModel.remarks) {
      this.$message.error("请输入批注！");
      return;
    }
    this.remarkLoading = true;
    this.caseInfoService
      .modifyCaseMemo({
        caseId: this.operateData.id,
        memo: this.remarkModel.remarks
      })
      .subscribe(
      data => {
        this.$message.success("保存成功！");
        this.remarkLoading = false;
        this.dialog.remark = false;
      },
      ({ msg }) => {
        this.$message.error(msg);
        this.remarkLoading = false;
      }
      );
  }

  refreshData() {
    // 判断查询实体是否全部为空
    let key: Array<string> = Object.keys(this.searchModel).filter(x => this.searchModel[x] !== '' && x !== 'companyCode')
    if (key && key.length > 0) {
      // 根据实体的内容进行查找
      this.caseInfoService.findCaseInfo(this.searchModel, this.pageService).subscribe(
        data => this.searchDataSet = data,
        err => this.$message.error(err.msg)
      )
    } else {
      this.$message('请至少填写一项查找条件')
    }
  }

}
</script>

<style lang="less">

</style>
