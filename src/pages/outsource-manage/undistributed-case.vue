<template>
  <section class="page undistributed-case">
    <data-form :model="undistributedModel" @onSearch="refreshData" :rules="undistributeRule" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请号" prop="caseNumber">
          <el-input v-model="undistributedModel.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5424">
          <el-input v-model="undistributedModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5425">
          <el-input v-model="undistributedModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="身份证号" prop="idCard" v-auth="5428">
          <el-input v-model="undistributedModel.idCard"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes">
          <el-cascader v-model="undistributedModel.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="逾期期数" prop="payStatus">
          <el-select v-model="undistributedModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorName">
          <el-input v-model="undistributedModel.collectorName"></el-input>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="5427">
          <number-range v-model="undistributedModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amtRange" v-auth="5426">
          <number-range v-model="undistributedModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="催收反馈" prop="follFeedbacks">
          <el-cascader v-model="undistributedModel.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesId">
          <el-select v-model="undistributedModel.seriesId" placeholder="请选择" clearable>
            <el-option v-for="{seriesName,id,index} in seriesNameList" :key="index" :label="seriesName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker type="date" :editable="false" v-model="undistributedModel.caseFollowInTime" placeholder="请选择日期" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="省份" prop="parentAreaId">
          <el-select v-model="undistributedModel.parentAreaId" clearable>
            <el-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="areaId">
          <el-select v-model="undistributedModel.areaId" clearable>
            <el-option v-for="{value,label} in this.undistributedModel['parentAreaId'] ? this.$city.getCityData({ level: 1, id: this.undistributedModel['parentAreaId'] }) : []" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="dialog.choiceOutSource = caseAllotClick()" v-auth="5429">手动分案</el-button>
        <el-button @click="circulationClick">申请流转</el-button>
      </template>
    </data-form>
    <data-box :data="undistributedDataSet" :page="pageService" :selectionList.sync="selectionList" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="detailObj = scope.row;dialog.detail = true" type="text">案件详情</el-button>
            <el-button @click="detailObj = scope.row;dialog.followRecord = true" type="text">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(8)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="city" label="地区" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.areaName}}</span>
            <span>{{scope.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
         <el-table-column prop="overdueAmount" label="逾期金额(元)" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
           <template slot-scope="scope">
            <span>{{scope.row.overdueAmount| toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="seriesName" label="产品类型" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="productName" label="产品名称" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="turnFromPool" label="流转来源" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.turnFromPool| dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" label="案件流入时间" :min-width="$helper.getColumnWidth(6)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.caseFollowInTime| dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>
    <!--手动分案（获取委外方）-->
    <el-dialog title="选择受托方" :visible.sync="dialog.choiceOutSource" width="60%" @open="ChoiceOutSourceOpen" :close-on-click-modal="false" :close-on-press-escape="false" @close="ChoiceOutSourceClose">
      <choice-out-source @success="refreshData" ref="choice-out-source" @close="dialog.choiceOutSource=false" ></choice-out-source>
    </el-dialog>
    <!-- 案件详情 -->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="detailObj.caseId" :caseNumber="detailObj.caseNumber"></case-detail>
    </el-dialog>
    <!-- 跟进记录 -->
    <el-dialog :title="detailObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.followRecord" append-to-body width="90%">
      <follow-record :caseNumber="detailObj.caseNumber"></follow-record>
    </el-dialog>
    <!-- 申请流转 -->
    <el-dialog title="案件申请流转" width="40%" :visible.sync="dialog.circulation" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="$refs['application-circulation'].reset()">
      <application-circulation :selectFilter="855" :caseNumber="circulationCaseId" @close="dialog.circulation=false;refreshData();" ref="application-circulation"></application-circulation>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter, Mutation, namespace, Action } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
import { QueryOutsourcePoolService } from "~/services/report-service/query-outsource-pool.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import ChoiceOutSource from "~/components/outsource-manage/undistributed-case/choice-out-source.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import ApplicationCirculation from "~/components/call-case/application-circulation.vue";
import clone from "clone";
import { Watch } from "vue-property-decorator";
const accManageModule = namespace("acc-manage");
const outsourceManageModule = namespace("outsource-manage");

@Auth(523)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    ChoiceOutSource,
    NumberRange,
    CaseDetail,
    FollowRecord,
    ApplicationCirculation
  }
})
export default class UndistributedCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @Dependencies(QueryOutsourcePoolService)
  private queryOutsourcePoolService: QueryOutsourcePoolService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Getter departmentData;
  @State principalList: any;
  @State outSourceList: any;
  @State companyList: any;
  @State seriesNameList;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @accManageModule.Action getCaseInfoByCaseId;
  @outsourceManageModule.Mutation updateSelectedList;
  @Watch("undistributedModel.deptCodes")
  deptCodesChange() {
    this.getcupoName();
  }
  @Watch("undistributedModel.follFeedbacks")
  follFeedbacksChange() {
    this.feedbackChange();
  }
  private accFeedback: any = []; // 催收反馈数据
  private undistributedDataSet: any = null;
  private undistributedModel: any = {
    outStatus: 167,
    caseNumber: "",
    payStatus: "",
    companyCode: "",
    followupBack: "",
    follFeedbacks: [],
    turnFromPool: "",
    collectorName: "",
    caseFollowInTime: "",
    personalName: "",
    mobileNo: "",
    batchNumber: "",
    seriesId: "",
    deptCode: "",
    deptCodes: [],
    parentAreaId: "",
    areaId: "",
    amtRange: {
      min: "",
      max: ""
    },
    overdueDays: {
      min: "",
      max: ""
    },
    idCard: ""
  };
  private selectionList: any = [];
  private circulationCaseId: any = []; // 申请流转案件ID
  private dialog: any = {
    choiceOutSource: false,
    caseDistribution: false,
    detail: false,
    followRecord: false,
    circulation: false
  };
  private selectedOutSource: any = [];
  // 当前操作行的数据
  private detailObj: any = {};
  private outSource: any = "outSource";
  private activeName: any = "cust-info";
  // 表单验证规则
  private undistributeRule = {
    mobileNo: { validator: this.$validator.phoneNumber, trigger: "blur" },
    idCard: { validator: this.$validator.idCard, trigger: "blur" }
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.undistributedModel.companyCode = this.userData.companyCode;
    }
    return this.undistributedModel.companyCode;
  }

  set companyCode(value) {
    this.undistributedModel.companyCode = value;
  }
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  refreshData() {
    this.queryOutsourcePoolService
      .queryDistribute(this.undistributedModel, this.pageService)
      .subscribe(
        data => (this.undistributedDataSet = data),
        err => this.$message.error(err.msg)
      );
  }
  /**
   * 手动分案
   */
  caseAllotClick() {
    if (this.selectionList.length === 0) {
      this.$message.info("请选择分案的案件");
      return;
    } else {
      this.updateSelectedList(this.selectionList);
      return true;
    }
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.undistributedModel.deptCodes.length > 0) {
      this.undistributedModel.deptCode = this.undistributedModel.deptCodes[
        this.undistributedModel.deptCodes.length - 1
      ];
    } else {
      this.undistributedModel.deptCode = "";
    }
  }
  /**
   * 申请流转
   */
  circulationClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要申请的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.dialog.circulation = true;
      let arr = this.selectionList.slice(0, this.selectionList.length);
      this.circulationCaseId = arr.map(v => {
        return v.caseId;
      });
    }
  }
  mounted() {
    // 催收反馈下拉框选项
    let valid = clone(this.$dict.getDictData("0019"));
    valid.forEach(v => {
      if (v.value === 88) {
        v.children = this.$dict.getDictData("0020");
      }
      if (v.value === 89) {
        v.children = this.$dict.getDictData("0021");
      }
      if (v.value === 835) {
        v.children = this.$dict.getDictData("0257");
      }
    });
    this.accFeedback = valid;
  }
  /**
   * 获取委外方
   */
  ChoiceOutSourceOpen() {
    this.$nextTick(() => {
      let choiceOutSource: any = this.$refs["choice-out-source"];
      choiceOutSource.refreshData(this.selectionList);
    });
  }
  ChoiceOutSourceClose() {
    let choiceOutSource: any = this.$refs["choice-out-source"];
    choiceOutSource.selectEmpty();
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.undistributedModel.followupBack = this.undistributedModel.follFeedbacks[
      this.undistributedModel.follFeedbacks.length - 1
    ];
    if (!this.undistributedModel.followupBack) {
      this.undistributedModel.followupBack = "";
    }
  }
}
</script>

<style lang="less">
</style>
