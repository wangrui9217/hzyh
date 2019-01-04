<template>
  <section class="page collection-remind">
    <data-form :model="callModle" @onSearch="refreshData" :page="pageService" :rules="rules" @handleResetForm="follFeedback">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="1162">
          <el-input v-model="callModle.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="1163">
          <el-input v-model="callModle.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="案件状态" prop="collectionStatus" v-auth="1167">
          <el-select v-model="callModle.collectionStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in caseStatus" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案件标记" prop="caseMark" v-auth="1172">
          <el-select v-model="callModle.caseMark" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0028')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="订单号" prop="orderId" v-auth="1171">-->
        <!--<el-input v-model="callModle.orderId"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="催收反馈" prop="follFeedbacks" v-auth="1174">
          <el-cascader v-model="callModle.follFeedbacks" :options="accFeedback" @change="feedbackChange" :props="{value:'value',label:'label'}" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="机构" prop="deptCodes" v-auth="1164">
          <el-cascader v-model="callModle.deptCodes" :options="departmentData" @change="getcupoName" :props="{value:'code',label:'name'}" change-on-select :show-all-levels="false" clearable style="line-height:1"></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="collectorId" v-auth="1165">
          <el-input v-model="callModle.collectorId"></el-input>
        </el-form-item>
        <el-form-item label="协催方式" prop="assistWay" v-auth="1170">
          <el-select v-model="callModle.assistWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0006')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店" prop="shopDeptId" v-auth="1173">
          <el-select v-model="callModle.shopDeptId">
            <el-option v-for="item in storeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="idCard" label="身份证号" v-auth="1169">
          <el-input v-model="callModle.idCard"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="caseMoney" v-auth="1166">
          <number-range v-model="callModle.caseMoney"></number-range>
        </el-form-item>
        <el-form-item label="逾期天数" prop="dayRange" v-auth="1168">
          <number-range v-model="callModle.dayRange" :isInteger="true"></number-range>
        </el-form-item>
      </template>
      <template slot="append">
        <el-radio-group v-model="caseMark" @change="ColorChange">
          <el-radio :label="126">无色</el-radio>
          <el-radio :label="127">红色</el-radio>
          <el-radio :label="128">蓝色</el-radio>
          <el-radio :label="129">绿色</el-radio>
        </el-radio-group>
      </template>
    </data-form>

    <data-box :data="callAccDataSet" :rowClass="rowClass" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService" ref="data-box">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="caseNumber" label="申请号" sortable='custom' :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>申请号: {{ scope.row.caseNumber }}</p>
              <span slot="reference" class="name-wrapper">
                  <el-button type="text" @click="openAccCenter({caseId:scope.row.caseId, searchModel:callModle})">{{scope.row.caseNumber}}</el-button>
              </span>
            </el-popover>
          </template>
        </el-table-column>
        <!--<el-table-column prop="orderId" label="订单号" sortable='custom' :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)" sortable='custom'>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" sortable='custom' :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <!--<el-table-column prop="leftDueDays" label="即将到期天数" sortable='custom' :min-width="$helper.getColumnWidth(5)">-->
        <!--</el-table-column>-->
        <el-table-column prop="overdueDays" label="逾期天数" sortable='custom' :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="collectorName" label="电话催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$dict.getDictName(scope.row.collectionStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followupTime" sortable='custom' label="跟进时间" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.followupTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" sortable='custom' label="案件流入日期" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.caseFollowInTime | dateTimeFormat}}</span>
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
        <el-table-column prop="assistWay" label="协催方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{$dict.getDictName(scope.row.assistWay)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leaveCaseFlag" label="留案标识" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <!--<el-button @click="redistributeClick(scope)" type="text" size="small" v-role="0x010118">重新分配</el-button>-->
            <el-button @click="phoneRecord(scope)" type="text" v-auth="1175">电话录音</el-button>
            <el-button @click="repair=scope.row,dialog.FollowRecord=true" type="text" v-auth="1176">跟进明细</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>

    <!--批量分配-->
    <el-dialog title="批量分配" :visible.sync="dialog.disabled" @open="loadData" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <MassDistribution @close="dialog.disabled=false" @refresh="refreshData" ref="refresh" :typeId="typeId"></MassDistribution>
    </el-dialog>
    <el-dialog title="电话录音" :visible.sync="dialog.phonerecord" @open="phoneRecordOpen" align="center">
      <PhoneRecord ref="phoneRecord"></PhoneRecord>
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
import { PageService } from "~/utils/page.service";
import { PrincipalService } from "~/services/business-service/principal.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { UserService } from "~/services/business-service/user.service";
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import PhoneRecord from "~/components/message-acc/phone-record.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";
import { State, Action, namespace, Getter } from "vuex-class";
import clone from "clone";

const accManageModule = namespace("acc-manage");

@Auth(1113)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    NumberRange,
    PhoneRecord,
    FollowRecord
  }
})
export default class CallCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(UserService) private userService: UserService;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;
  @Getter departmentData;
  @State departmentList: any;
  @accManageModule.Action openAccCenter;
  @State storeList: any;
  @Getter isSupperAdmin: boolean;

  private selectionList: any = [];
  private callAccDataSet = null;
  private accFeedback: any = []; // 催收反馈数据
  private orgNameList: any = [];
  private dataName: any = []; //委托方
  private typeId: any = 69;
  private caseNumber: any = {};
  private CaseRowData: any = {};
  private repair: any = {};
  private caseMark: any = "";
  private rowClass: any = scope => {
    if (scope.row.caseMark === 126) {
      return "white-row";
    }
    if (scope.row.caseMark === 127) {
      return "red-row";
    }
    if (scope.row.caseMark === 128) {
      return "blue-row";
    }
    if (scope.row.caseMark === 129) {
      return "green-row";
    }
  };
  private dialog: any = {
    disabled: false,
    phonerecord: false,
    FollowRecord: false
  };
  private caseStatus = []; // 案件状态
  private rules: any = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
  private callModle: any = {
    personalName: "", // 客户姓名
    mobileNo: "", // 手机号
    mobileNoX: "",
    caseMoney: {
      min: "",
      max: ""
    },
    dayRange: { min: "", max: "" },
    orderId: "", // 订单号
    collectionStatus: "", // 状态
    principalId: "", // 委托方
    idCard: "", // 身份证
    collectorId: "", // 催收员
    deptCode: "", // 机构
    assistFlag: "", // 是否协催
    assistWay: "", // 协催方式
    caseMark: "", // 案件标记
    companyCode: "", // 公司code
    followupBack: "", // 催收反馈
    overdueDays: [], // 逾期天数
    cupoName: "",
    deptCodes: [],
    follFeedbacks: [],
    payStatus: "M0", // 逾期期数
    overDuePayStatus: "M0",
    collectionType: 15,
    collectionStatusList: "21,172",
    shopDeptId: "",
    realPayMinAmt: "", // 最小还款金额
    realPayMaxAmt: "", // 最大还款金额
    realPayAmount: { min: "", max: "" }, // 还款金额
    leftDueDays: "" //即将到期天数
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.callModle.companyCode = this.userData.companyCode;
    }
    return this.callModle.companyCode;
  }

  set companyCode(value) {
    this.callModle.companyCode = value;
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
    let acc: any = this.$dict.getDictData("0004");
    this.caseStatus = acc.filter(v => v.value != "25");
  }
  follFeedback() {
    this.callModle.followupBack = "";
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  refreshData() {
    this.caseInfoInquiryService
      .getCaseInfoByCondition(
        this.callModle,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => {
          this.callAccDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 获取委托方
   */
  getDataList() {
    this.principalService
      .getPrincipalList({
        companyCode: this.callModle.companyCode
      })
      .subscribe(
        data => {
          this.dataName = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 颜色标记
   */
  ColorChange() {
    if (this.caseMark) {
      if (this.selectionList.length === 0) {
        this.$alert("请选择要标记的案件", "提示", {
          confirmButtonText: "确定"
        });
        this.caseMark = "";
      } else {
        let arr = this.selectionList.slice(0, this.selectionList.length);
        let amount = arr.map(v => {
          return v.caseId;
        });
        let MarkData: any = {
          caseIds: amount,
          colorNum: this.caseMark
        };
        this.accTelPoolService.telCaseMarkColor(MarkData).subscribe(
          data => {
            this.refreshData();
            this.caseMark = "";
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      }
    }
  }
  /**
   * 催收反馈Change
   */
  feedbackChange() {
    this.callModle.followupBack = this.callModle.follFeedbacks[
      this.callModle.follFeedbacks.length - 1
    ];
    if (!this.callModle.followupBack) {
      this.callModle.followupBack = "";
    }
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  /**
   * 根据部门获取催收员
   */
  getcupoName() {
    if (this.callModle.deptCodes.length > 0) {
      this.callModle.deptCode = this.callModle.deptCodes[
        this.callModle.deptCodes.length - 1
      ];
    } else {
      this.callModle.deptCode = "";
    }
  }

  /**
   * 批量分配
   */
  batchClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要分配的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      let arr = this.selectionList.slice(0, this.selectionList.length);
      let amount = arr.map(v => {
        return v.caseId;
      });
      this.accTelPoolService
        .checkCaseAssist({
          list: amount
        })
        .subscribe(
          data => {
            if (data.length !== 0) {
              this.$confirm(
                "所选案件存在协催申请或协催案件， 是否继续分配？",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  this.dialog.disabled = true;
                })
                .catch(() => {
                  this.$message({
                    type: "success",
                    message: "取消分配!"
                  });
                });
            } else {
              this.dialog.disabled = true;
            }
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    }
  }
  /**
   * 获取催收专员案件数(批量分配)
   */
  loadData() {
    // this.$nextTick(() => {
    //   this.$refs['refresh'].load()
    // })
  }
  /**
   * 留案
   */
  leaveCaseClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要留案的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.$confirm("您确定留案吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = this.selectionList.slice(0, this.selectionList.length);
          let amount = arr.map(v => {
            return v.caseId;
          });
          this.accTelPoolService
            .leaveTelCase({
              caseIds: amount,
              type: 0,
              companyCode: this.callModle.companyCode
            })
            .subscribe(
              data => {
                this.refreshData();
                this.$message({
                  type: "success",
                  message: `留案申请成功,剩余可留案数${data.caseNum}个!`
                });
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
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
   * 取消留案
   */
  cancleleaveCase() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要取消留案的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.$confirm("您确定取消留案吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = this.selectionList.slice(0, this.selectionList.length);
          let amount = arr.map(v => {
            return v.caseId;
          });
          this.accTelPoolService
            .cancelLeaveCase({
              caseIds: amount,
              type: 0,
              companyCode: this.callModle.companyCode
            })
            .subscribe(
              data => {
                this.refreshData();
                this.$message({
                  type: "success",
                  message: `操作成功,剩余可留案数${data.caseNum}个!`
                });
              },
              ({ msg }) => {
                this.$message.error(msg);
              }
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
   * 提前流转
   */
  async applyFlowClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要流转的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      let data: any = await this.$prompt("请输入申请原因：", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).catch(() => {});

      let amount = this.selectionList.map(v => v.caseId);

      this.accTelPoolService
        .telAdvanceCirculation({
          caseIds: amount,
          type: 0,
          reason: data.value
        })
        .subscribe(
          data => {
            this.refreshData();
            this.$message({
              type: "success",
              message: "申请提前流转成功！"
            });
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
    }
  }
  /**
   * 电话录音
   */
  phoneRecord(scope) {
    this.dialog.phonerecord = true;
    this.caseNumber = scope.row.caseNumber;
  }
  /**
   * 电话录音打开
   */
  phoneRecordOpen() {
    this.$nextTick(() => {
      let phoneRecord: any = this.$refs["phoneRecord"];
      // phoneRecord.refreshMessage(this.caseNumber)
    });
  }
}
</script>

<style lang="less">
</style>
