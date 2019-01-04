<template>
  <section class="page search-case">
    <data-form :model="searchModel" @onSearch="refreshData" :page="pageService" :rules="searchRule">
      <template slot="default-input">
         <el-form-item label="申请号" prop="caseNumber" >
          <el-input v-model="searchModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personName" v-auth="5083">
          <el-input v-model="searchModel.personName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5084">
          <el-input v-model="searchModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" >
          <el-input v-model="searchModel.idCard" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" >
          <el-input v-model="searchModel.batchNumber" :maxlength="25"></el-input>
        </el-form-item>
        <el-form-item label="流转来源" prop="turnFromPool" >
        <el-select v-model="searchModel.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0254')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流转去向" prop="turnToPool" >
        <el-select v-model="searchModel.turnToPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0258')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受托方" prop="principalName"  v-auth="5004">
          <el-select v-model="searchModel.principalName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
      </template>
    </data-form>
    <data-box :data="searchDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" v-auth="5022">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="personName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personName?scope.row.personName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期总金额(元)" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期阶段" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="followupBack" label="催收反馈" show-overflow-tooltip	 :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" v-if="scope.row.followupBack===90">
              <p class="text-left">还款金额: {{ scope.row.promiseAmt | toThousands }}元</p>
              <p class="text-left">还款日期: {{ scope.row.promiseTime | dateFormat}}</p>
              <template slot="reference" class="name-wrapper">
                <el-button type="text" style="color:green">{{scope.row.followupBack|dictConvert}}</el-button>
              </template>
            </el-popover>
            <span v-else>{{scope.row.followupBack|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principalName" label="受托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="currentCollector" label="当前催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="latelyCollector" label="上一个催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column label="流转来源" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.turnFromPool | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="流转去向" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.turnToPool | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" label="案件流转时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupTime" label="案件跟进时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.followupTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="流转审核状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.turnApprovalStatus | dictConvert}}</span>
          </template>
        </el-table-column> -->
        
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
    <!--跟进记录-->
    <el-dialog :title="repair.caseNumber+'案件跟进记录'" width="90%" :visible.sync="dialog.FollowRecord" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <FollowRecord :caseNumber="repair.caseNumber"></FollowRecord>
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
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service.ts";
import { ExportCaseInfoService } from "~/services/report-service/export-case-info.service";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/case-search/follow-record.vue";
import { CommonService } from "~/utils/common.service";

const accManageModule = namespace("acc-manage");
@Auth(373)
@Layout("workspace")
@Component({
  components: {
    CaseDetail,
    DataForm,
    DataBox,
    FollowRecord
  }
})
export default class SearchCase extends Vue {
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
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
  private repair: any = {};

  private searchModel: any = {
    caseNumber: "", // 申请号
    companyCode: "",
    personName: "",
    mobileNo: "",
    idCard: "",
    batchNumber: "", //批次号
    turnFromPool: "", //流转来源
    turnToPool: "", //流转去向
    principalId: "", //委托方
    turnApprovalStatus: "220", //流转审核状态
    principalName: "" //受托方
  };
  private remarkLoading: any = false;
  private searchDataSet: Array<any> = [];
  private dialog: any = {
    detail: false,
    remark: false,
    FollowRecord: false
  };
  private operateData: any = {};
  mounted() {
    this.refreshData();
  }
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.searchModel.companyCode = this.userData.companyCode;
    }
    return this.searchModel.companyCode;
  }

  set companyCode(value) {
    this.searchModel.companyCode = value;
  }

  // 过滤公司数据
  getPrincipalList() {
    return this.principalList.filter(
      x => x.companyCode === this.searchModel.companyCode
    );
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

  openDetail(scope) {
    this.operateData = scope.row;
    this.dialog.detail = true;
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
    this.caseInfoInquiryService
      .getCaseTurnRecord(this.searchModel, this.pageService, {
        applyDate: "desc"
      })
      .subscribe(
        data => {
          this.searchDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>

<style lang="less">
</style>
