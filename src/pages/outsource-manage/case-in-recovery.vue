<template>
  <section class="page case-in-recovery">
    <data-form :model="params" @onSearch="refreshData" :page="pageService" :rules="callRule">
      <template slot="default-input">
         <el-form-item label="申请号" prop="caseNumber" >
          <el-input v-model="params.caseNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5449">
          <el-input v-model="params.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5450">
          <el-input v-model="params.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="身份证号" prop="idCard" v-auth="5451">
          <el-input v-model="params.idCard" class="large"></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5452">
          <el-input v-model="params.batchNumber"></el-input>
        </el-form-item>
         <el-form-item label="机构" prop="deptCodes" >
          <el-cascader v-model="params.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" >
          <el-select v-model="params.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="受托方" prop="outsId" v-auth="5453">
          <el-select v-model="params.outsId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,outsName} in getOutSourceList()" :key="index" :label="outsName" :value="id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="委托方" prop="principalId"  >
          <el-select v-model="params.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collector" v-auth="5011">
          <el-input v-model="params.collector"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="seriesId" >
          <el-select v-model="params.seriesId" placeholder="请选择" clearable>
            <el-option v-for="{id,seriesName} in productType" :key="id" :label="seriesName" :value="seriesName"></el-option>
          </el-select>
        </el-form-item>
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="overdueAmount" v-auth="5454">
            <number-range v-model="params.overdueAmount"></number-range>
          </el-form-item>
        </div>
        <div class="inline-box">
          <el-form-item label="逾期期数" prop="payStatus" >
            <el-select v-model="params.payStatus" placeholder="请选择" clearable>
              <el-option label="M0" value="M0"></el-option>
              <el-option label="M1" value="M1"></el-option>
              <el-option label="M2" value="M2"></el-option>
              <el-option label="M3" value="M3"></el-option>
              <el-option label="M4" value="M4"></el-option>
              <el-option label="M5" value="M5"></el-option>
              <el-option label="M6+" value="M6"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="inline-box">
          <el-form-item label="逾期天数" prop="overdueDays" v-auth="5455">
            <number-range v-model="params.overdueDays" :isInteger="true"></number-range>
          </el-form-item>
        </div>
        <el-form-item label="催收反馈" prop="follFeedbacks" v-auth="5007">
          <el-cascader v-model="params.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="流转来源" prop="turnFromPool" >
        <el-select v-model="params.turnFromPool" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.turnFromPoolOption" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="诉讼阶段" prop="lawsuitResult">
          <el-select v-model="params.lawsuitResult" placeholder="请选择" clearable>
              <el-option  key="" label="初始" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反欺诈反馈" prop="antiFraudResult" >
          <el-select v-model="params.antiFraudResult" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0255')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followupTime" >
          <el-date-picker class="daterange-large" range-separator="~" type="daterange" :editable="false" v-model="params.followupTime" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="案件流入时间" prop="caseFollowInTime">
          <el-date-picker  type="date" class="promise" :editable="false" v-model="params.caseFollowInTime" placeholder="选择日期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="流转去向" prop="turnToPool" >
          <el-select v-model="params.turnToPool" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0258')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流转状态" prop="turnStatus" >
          <el-select v-model="params.turnStatus" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in this.$dict.getDictData('0048')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="省份/城市" prop="cityList">
            <el-cascader v-model="params.cityList" :options="$city.getCityData({ level : 2 })" change-on-select clearable></el-cascader>
        </el-form-item>
      </template>
      <template slot="default-button">
        <!--按钮区域-->
        <!--<el-button @click="deleteCase" v-auth="1503">删除案件</el-button>-->
        <el-button @click="OperationRecordsClick" v-auth="5457">移入委外待分配</el-button>
        <!-- <el-button @click="moveToVerificationClick" v-auth="5458">移入核销案件池</el-button>
        <el-button @click="moveToJudicialClick" v-auth="5459">移入司法案件池</el-button> -->
        <el-button @click="circulationClick" >申请流转</el-button>
        
      </template>
    </data-form>
    <data-box :data="recoveryDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="operateData = scope.row;dialog.detail= true" type="text" >案件详情</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" >跟进明细</el-button>

          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号 " :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
         <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号 " :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="cityName" label="地区" sortable='custom' :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.areaName?scope.row.areaName:""}}</span>
            <span>{{scope.row.city?scope.row.city:""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数 " :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.payStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数 " :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueDays}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" sortable='custom' :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
         <el-table-column prop="seriesName" label="产品类型" sortable='custom' :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collector" label="当前催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  label="流转来源" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.turnFromPool | dictConvert}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="caseFollowInTime" sortable='custom' label="案件流入时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outTime" label="委案日期 " :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.outTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overOutSourceTime" label="到期日期 " :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.overOutSourceTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupTime" label="跟进时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.followupTime | dateTimeFormat}}</span>
          </template>
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
         <el-table-column prop="leaveCaseFlag" label="留案标识" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column  label="流转去向" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.turnToPool | dictConvert}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="lawsuitResult" label="诉讼阶段" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="antiFraudResult" label="反欺诈结果" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
      </template>
    </data-box>

    <el-dialog title="案件分配" :visible.sync="dialog.AgDistributionDialog" width="40%">
      <AgDistribution @close="dialog.AgDistributionDialog=false;" @refresh="pageService.reset();refreshData()" :selectionList.sync="selectionList" @success="dialog.AgDistributionDialog=false;refreshData()"></AgDistribution>
    </el-dialog>
    <el-dialog title="核销管理" :visible.sync="dialog.verifyManage" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <span style="float:left">核销说明:</span>
      <el-input type="textarea" :rows="2" v-model="verifyInfo"></el-input>
      <div style="text-align: center;margin-top:10px">
        <el-button @click="verifyInfoCancelClick">取消</el-button>
        <el-button @click="verifyInfoConfirmClick" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="司法管理" :visible.sync="dialog.judicialManage" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <span style="float:left">司法说明:</span>
      <el-input type="textarea" :rows="2" v-model="judicialInfo"></el-input>
      <div style="text-align: center;margin-top:10px">
        <el-button @click="judicialInfoCancelClick">取消</el-button>
        <el-button @click="judicialInfoConfirmClick" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
     <!-- 申请流转 -->
    <el-dialog title="案件申请流转" width="40%" :visible.sync="dialog.circulation" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="$refs['application-circulation'].reset();refreshData()">
      <application-circulation :selectFilter="855" :caseNumber="circulationCaseId" @close="dialog.circulation=false;" ref="application-circulation"></application-circulation>
    </el-dialog>
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="operateData.caseId"  :caseNumber="operateData.caseNumber"></case-detail>
    </el-dialog>
    <!--查看案件明细的案件跟进记录-->
    <el-dialog :title="repair.caseNumber+'案件跟进明细'" width="90%" :visible.sync="dialog.FollowRecord" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <FollowRecord :caseNumber="repair.caseNumber"></FollowRecord>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Action, Getter } from "vuex-class";
import { PageService } from "~/utils/page.service";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
import { CaseInfoHistoryService } from "~/services/business-service/case-info-history.service";
import { CaseReturnService } from "~/services/business-service/case-return.service";
import { QueryOutsourcePoolService } from "~/services/report-service/query-outsource-pool.service";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import AgDistribution from "~/components/outsource-manage/case-in-recovery/ag-distribution.vue";
import ApplicationCirculation from "~/components/call-case/application-circulation.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { FilterService } from "~/utils/filter.service";

import clone from "clone";

@Auth(526)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    AgDistribution,
    CaseDetail,
    FollowRecord,
    ApplicationCirculation
  }
})
export default class CaseInRecovery extends Vue {
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @Dependencies(CaseInfoHistoryService)
  private caseInfoHistoryService: CaseInfoHistoryService;
  @Dependencies(CaseReturnService) private caseReturnService: CaseReturnService;
  @Dependencies(QueryOutsourcePoolService)
  private queryOutsourcePoolService: QueryOutsourcePoolService;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;
  @Getter departmentData;
  @Getter isSupperAdmin: boolean;
  @State outSourceList: any;

  private verifyInfo: any = "";
  private judicialInfo: any = "";
  private selectionList: any = [];
  private Time: any = [];
  private recoveryDataSet = null;
  private repair: any = {};
  private dialog: any = {
    AgDistributionDialog: false,
    verifyManage: false,
    judicialManage: false,
    detail: false,
    FollowRecord: false,
    circulation: false //申请流转
  };
  private callRule = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
  private params: any = {
    overOutsourceTime: [], // 结案日期
    overdueAmount: { min: "", max: "" },
    overdueDays: { min: "", max: "" },
    payStatus: "",
    companyCode: "",
    personalName: "",
    mobileNo: "",
    idCard: "",
    batchNumber: "",
    outsId: "",
    caseNumber: "",
    deptCodes: [],
    caseMark: "",
    principalId: "",
    collector: "",
    seriesId: "",
    follFeedbacks: "",
    turnFromPool: "",
    lawsuitResult: "",
    antiFraudResult: "",
    followupTime: "", //跟进时间
    caseFollowInTime: "", //案件流入时间
    turnToPool: "", //流转去向
    turnStatus: "", //流转状态
    cityList: [] //城市
  };
  private accFeedback: any = []; // 催收反馈数据
  private circulationCaseId: any = []; // 申请流转案件ID
  private productType: any = {};
  private turnFromPoolOption: any = {}; //流转来源过滤后数据
  // 当前操作行的数据
  private operateData: any = {};
  private submitLoading: Boolean = false;
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.params.companyCode = this.userData.companyCode;
    }
    return this.params.companyCode;
  }

  set companyCode(value) {
    this.params.companyCode = value;
  }

  /**
   * 过滤受托方
   */
  getOutSourceList() {
    return this.outSourceList.filter(
      x => x.companyCode === this.params.companyCode
    );
  }
  refreshData() {
    this.queryOutsourcePoolService
      .queryReturn(this.params, this.pageService)
      .subscribe(
        data => {
          this.recoveryDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
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
    let turnFrom: any = this.$dict.getDictData("0254");
    this.turnFromPoolOption = turnFrom.filter(
      v => v.value != "825" && v.value != "826"
    );
    this.getProductType();
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.params.followupBack = this.params.follFeedbacks[
      this.params.follFeedbacks.length - 1
    ];
    if (!this.params.followupBack) {
      this.params.followupBack = "";
    }
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.params.deptCodes.length > 0) {
      this.params.deptCode = this.params.deptCodes[
        this.params.deptCodes.length - 1
      ];
    } else {
      this.params.deptCode = "";
    }
  }
  /**
   * 获取产品类型
   */
  getProductType() {
    this.productSeriesService.getAllProductSeries().subscribe(
      data => {
        this.productType = data;
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 删除案件
   */
  deleteCase() {
    let ids = this.selectionList.map(v => v.id);
    if (this.selectionList.length) {
      this.$confirm("确定删除已选择的案件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.caseInfoHistoryService
            .deleteReturnCase({
              ids: ids
            })
            .subscribe(
              data => {
                this.$message.success("操作成功！");
                this.pageService.reset();
                this.refreshData();
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
            );
        })
        .catch(() => {
          this.$message("取消分配");
        });
    } else {
      this.$message("请选择要删除的案件！");
    }
  }
  /**
   * 移入待分配案件池
   */
  OperationRecordsClick() {
    if (this.selectionList.length === 0) {
      this.$message("请选择要移入委外待分配的案件！");
    } else {
      this.$confirm(
        `选择了${this.selectionList.length}条案件,确定要移入委外待分配吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let paramData: any = {
            type: "1",
            ids: this.selectionList.map(v => v.id)
          };
          this.caseReturnService.reDisRecoverCase(paramData).subscribe(
            data => {
              this.$message.success("操作成功");
              this.refreshData();
            },
            err => this.$message.error(err.msg)
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  }
  /**
   * 移入核销案件池
   */
  moveToVerificationClick() {
    if (this.selectionList.length === 0) {
      this.$message("请选择要核销的案件！");
    } else {
      this.dialog.verifyManage = true;
    }
  }
  /**
   * 核销说明取消
   */
  verifyInfoCancelClick() {
    this.dialog.verifyManage = false;
    this.verifyInfo = "";
  }
  /**
   * 核销说明确定
   */
  verifyInfoConfirmClick() {
    if (!this.verifyInfo) {
      this.$message("请输入核销说明");
    } else {
      this.submitLoading = true;
      this.caseReturnService
        .moveToVerification({
          ids: this.selectionList.map(v => v.id),
          memo: this.verifyInfo
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("操作成功！");
            this.refreshData();
            this.dialog.verifyManage = false;
            this.verifyInfo = "";
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
    }
  }
  /**
   * 移入司法案件池
   */
  moveToJudicialClick() {
    if (this.selectionList.length === 0) {
      this.$message("请选择要司法的案件！");
    } else {
      this.dialog.judicialManage = true;
    }
  }
  /**
   * 司法说明取消
   */
  judicialInfoCancelClick() {
    this.dialog.judicialManage = false;
    this.judicialInfo = "";
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  /**
   * 司法说明确定
   */
  judicialInfoConfirmClick() {
    if (!this.judicialInfo) {
      this.$message("请输入司法说明");
    } else {
      this.submitLoading = true;
      this.caseReturnService
        .moveToJudicial({
          ids: this.selectionList.map(v => v.id),
          memo: this.judicialInfo
        })
        .subscribe(
          data => {
            this.submitLoading = false;
            this.$message.success("操作成功！");
            this.refreshData();
            this.dialog.judicialManage = false;
            this.judicialInfo = "";
          },
          ({ msg }) => {
            this.submitLoading = false;
            this.$message.error(msg);
          }
        );
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
}
</script>

<style lang="less">
</style>
