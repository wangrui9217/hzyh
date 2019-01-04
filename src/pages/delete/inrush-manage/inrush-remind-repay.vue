<template>
  <section class="page inrush-remind-repay">
    <data-form :model="closedModel" @onSearch="refreshData" :rules="inrushRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="closedModel.companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="1437">
          <el-input v-model="closedModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="1438">
          <el-input v-model="closedModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="订单号" prop="orderId" v-auth="1439">
          <el-input v-model="closedModel.orderId"></el-input>
        </el-form-item>
        <el-form-item label="委案日期" prop="delegationDate" v-auth="1440">
          <el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="closedModel.delegationDate" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange" v-auth="1441">
          <number-range v-model="closedModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="1442">
          <el-select v-model="closedModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="1443">
          <number-range v-model="closedModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="门店" prop="shopDeptId" v-auth="1444">
          <el-select v-model="closedModel.shopDeptId" placeholder="请选择" clearable>
            <el-option v-for="{name,id} in storeList" :key="id" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="closedDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号 " :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <!--<el-table-column prop="orderId" label="订单号" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>-->
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号 " :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数 " :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmt" label="逾期金额(元) " align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmt | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="latelyPayAmount" label="最近还款金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.latelyPayAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="latelyPayDate" label="最近还款日 " :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.latelyPayDate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="催收部门" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telCollector" label="电催催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="outBoundCollector" label="外访催收员" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="assistFlag" label="是否协催" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.assistFlag===0">否</span>
            <span v-if="scope.row.assistFlag===1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="compId" label="门店" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="shopDeptName" label="业务部门" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="跟进记录" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="followRecordClick(scope.row)" type="text" v-auth="1445">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--设置导出项-->
    <el-dialog title="设置导出项" :visible.sync="dialog.setExportItems" width="50%" :center="true">
      <set-export-items ref="set-export-items" :allData="allData" :category="category" @close="dialog.setExportItems=false"></set-export-items>
    </el-dialog>
    <!--查看跟进记录-->
    <el-dialog :center="true" :title="followObj.caseNumber+'案件跟进明细'" :visible.sync="dialog.followRecord" append-to-body width="80%">
      <follow-record :caseNumber="followObj.caseNumber"></follow-record>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { CaseInfoReportService } from "~/services/report-service/case-info-report.service";
import { ExportFollowupService } from "~/services/report-service/export-followup.service";

import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import SetExportItems from "~/components/inrushcase-manage/set-export-items.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import NumberRange from "~/components/common/number-range.vue";

@Auth(1121)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    SetExportItems,
    FollowRecord,
    NumberRange
  }
})
export default class InrushRemindRepay extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoReportService)
  private caseInfoReportService: CaseInfoReportService;
  @Dependencies(ExportFollowupService)
  private exportFollowupService: ExportFollowupService;

  @State userData: any;
  @State principalList: any;
  @State storeList: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  private selectionList: any = [];
  private closedModel: any = {};
  private closedDataSet: Array<any> = [];
  private category: any = "";
  private dialog: any = {};
  private allData: any;
  private followObj: any = {
    caseNumber: ""
  };
  // 表单验证规则
  private inrushRule = {
    mobileNo: [
      {
        validator: this.$validator.phoneNumber,
        trigger: "blur"
      }
    ]
  };
  created() {
    this.dialog = {
      setExportItems: false,
      followRecord: false
    };
    this.allData = {
      basicOptions: [
        "客户姓名",
        "身份证号",
        "省份",
        "城市",
        "手机号码",
        "身份证户籍地址",
        "家庭住址",
        "固定电话"
      ],
      workOptions: ["工作单位名称", "工作单位地址", "工作单位电话"],
      contactOptions: [
        "姓名",
        "手机号码",
        "住宅电话",
        "现居住地址",
        "与客户关系",
        "工作单位",
        "单位电话"
      ],
      caseInfoOptions: [
        "产品系列",
        "合同编号",
        "贷款日期",
        "合同金额",
        "剩余本金(元)",
        "剩余利息(元)",
        "逾期总金额(元)",
        "逾期本金(元)",
        "逾期利息(元)",
        "逾期罚息(元)",
        "还款期数",
        "每期还款金额(元)",
        "其他费用(元)",
        "逾期日期",
        "逾期天数",
        "已还款金额(元)",
        "已还款期数",
        "最近还款日期",
        "最近还款金额(元)",
        "佣金比例(%)"
      ],
      openAccountOptions: ["客户还款卡银行", "客户还款卡号"],
      followAccountOptions: [
        "跟进时间",
        "跟进方式",
        "催收对象",
        "姓名",
        "电话/地址",
        "催收反馈",
        "跟进记录",
        "跟进人员"
      ]
    };
    this.closedModel = {
      orderId: "",
      companyCode: "",
      personalName: "",
      mobileNo: "",
      principalId: "",
      delegationDate: [],
      closeDate: [],
      overdueMaxAmt: "",
      overdueMinAmt: "",
      overMaxDay: "",
      overMinDay: "",
      overdueDays: { min: "", max: "" },
      amtRange: { min: "", max: "" },
      overDuePayStatus: "M1+",
      payStatus: "",
      shopDeptId: ""
    };
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  mounted() {
    this.closedModel.companyCode = this.userData.companyCode;
    this.refreshData();
  }
  refreshData() {
    this.caseInfoReportService
      .queryLatelyPayCase(this.closedModel, this.pageService)
      .subscribe(
        data => {
          this.closedDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 设置导出项
   */
  setExportItemsClick() {
    this.dialog.setExportItems = true;
    this.category = 6;
    this.$nextTick(() => {
      let setExportItems: any = this.$refs["set-export-items"];
      setExportItems.checkExportItems();
    });
  }
  /**
   * 导出跟进记录
   */
  exportfollowRecordClick() {
    let batchList = this.selectionList.map(v => {
      return v.batchNumber;
    });
    let exportModel: any = {
      batchNumberList: batchList,
      type: 0,
      companyCode: this.userData.companyCode
    };
    this.exportFollowupService.exportFollowupRecord(exportModel).subscribe(
      data => {
        this.$message({
          type: "info",
          message: "开始导出"
        });
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 查看案件详情
   */
  followRecordClick(row) {
    this.dialog.followRecord = true;
    this.followObj.caseNumber = row.caseNumber;
  }
}
</script>

<style lang="less">
</style>
