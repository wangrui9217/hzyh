<template>
  <section class="page assist-case">
    <data-form :model="assistModel" @onSearch="refreshData" :page="pageService" buttonWrap>
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5361">
          <el-input v-model="assistModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5362">
          <el-input v-model="assistModel.mobileNo"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="amountRange" v-auth="5363">
          <number-range v-model="assistModel.amountRange"></number-range>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchClick" v-auth="5364">批量分配</el-button>
        <!-- <el-button @click="leaveClick" v-auth="5365">留案</el-button>
        <el-button @click="cancelleaveClick" v-auth="5366">取消留案</el-button> -->
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

    <data-box :data="assistDataSet" :rowClass="rowClass" :selectionList.sync="selectionList" @onPageChange="refreshData" :sort="sortService" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button @click="redialog.disabled = true,cupodata=scope.row" type="text" size="small" v-if="scope.row.assistStatus===117" v-auth="5367">案件分配</el-button>
            <el-button @click="redialog.disabled = true,cupodata=scope.row" type="text" size="small" v-else v-auth="5365">重新分配</el-button>
            <el-button @click="assistEndClick(scope)" type="text" size="small" v-auth="5368">结束协催</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)" sortable='custom'>
          <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>申请号: {{ scope.row.caseNumber}}</p>
            <span slot="reference">
              <el-button type="text" :disabled="scope.row.assistStatus === 117" @click="openAccCenter({caseId:scope.row.caseId, searchModel:assistModel,assistId:scope.row.assistId})" >{{scope.row.caseNumber}}</el-button>
            </span>
          </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.mobileNo | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assistWay" label="协催方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.assistWay | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assistStatus" label="案件状态" :min-width="$helper.getColumnWidth(4)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.assistStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFlowinTime" label="流入日期" :min-width="$helper.getColumnWidth(6)" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.caseFlowinTime | dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leaveCaseFlag" label="留案标志" :min-width="$helper.getColumnWidth(4)" sortable='custom'>
          <template slot-scope="scope">
            <span v-if="scope.row.leaveCaseFlag=='0'">非留案</span>
            <span v-if="scope.row.leaveCaseFlag=='1'">留案</span>
          </template>
        </el-table-column>
        <el-table-column prop="latelyCollectorName" label="上一个协催员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="currentCollectorName" label="当前催收员" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="assistCollectorName" label="协催员" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>

    <!--批量分配-->
    <el-dialog title="批量分配" :center="true" :visible.sync="dialog.disabled" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @open="loadData">
      <mass-distribution @close="dialog.disabled=false" @distributionData="distributionData" :collectionType="'xc'" :selectionList="selectionList" @refresh="refreshData" ref="mass" @confirmDistribution="confirmSend"></mass-distribution>
    </el-dialog>

    <!--重新分配-->
    <el-dialog title="选择催收专员" :center="true" :visible.sync="redialog.disabled" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" >
      <again-distribution @close="redialog.disabled=false" @refreshList="refreshData()" :cupodata="cupodata" :typeId="typeId"></again-distribution>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { CaseAssistService } from "~/services/business-service/case-assist.service";
import { CaseAssistApplyProcessService } from "~/services/business-service/case-assist-apply-process.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { PageService } from "~/utils/page.service";
import { SortService } from "~/utils/sort.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import AgainDistribution from "~/components/assist-acc/assist-case/again-distribution.vue";
import MassDistribution from "~/components/assist-acc/mass-distribution.vue";
import { State, Action, namespace, Getter } from "vuex-class";

const accManageModule = namespace("acc-manage");

@Auth(334)
@Layout("workspace")
@Component({
  components: {
    AgainDistribution,
    MassDistribution,
    NumberRange,
    DataForm,
    DataBox
  }
})
export default class AssistCase extends Vue {
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(CaseAssistApplyProcessService)
  private caseAssistApplyProcessService: CaseAssistApplyProcessService;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(SortService) private sortService: SortService;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  @accManageModule.Action openAccCenter;

  private assistDataSet: Array<any> = [];
  private assistModel: any = {
    orderId: "",
    personalName: "",
    companyCode: "",
    mobileNo: "",
    amountRange: { min: "", max: "" },
    collectionType: 17,
    assistStatusList: "28,117,118"
  };
  private rowClass: any = scope => {
    if (scope.row.markId === 126) {
      return "white-row";
    }
    if (scope.row.markId === 127) {
      return "red-row";
    }
    if (scope.row.markId === 128) {
      return "blue-row";
    }
    if (scope.row.markId === 129) {
      return "green-row";
    }
  };
  private cupor: any = [];
  private todayPer: any = null;
  private typeId: any = 71;
  private caseMark: any = "";
  private selectionList: any = [];
  private assistObj: any = {};
  private dialog: any = {
    disabled: false,
    batch: false,
    choose: false,
    module: false,
    list: false
  };
  private redialog: any = {
    disabled: false
  };
  private cupodata: any = {};
  private confirmData: any = {};
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.assistModel.companyCode = this.userData.companyCode;
    }
    return this.assistModel.companyCode;
  }

  set companyCode(value) {
    this.assistModel.companyCode = value;
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  /**
   * 获取批量分配信息
   */
  distributionData(data) {
    this.confirmData = data;
  }
  /**
   * 确定分配接口调用
   */
  confirmSend() {
    let sendData: any = {
      batchInfoModelList: this.confirmData.batchInfoModelList,
      amount: this.confirmData.amount,
      assistIds: this.confirmData.assistIds
    };
    this.caseAssistService.batchCaseAssist(sendData).subscribe(
      data => {
        this.refreshData();
        this.dialog.disabled = false;
        this.$message({
          type: "success",
          message: `成功分配${this.confirmData.allocated}个案件！`
        });
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
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
      this.dialog.disabled = true;
    }
  }
  /**
   * 留案
   */
  leaveClick() {
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
            return v.assistId;
          });
          let leaveData: any = {
            caseIds: amount,
            companyCode:
              this.userData.companyCode || this.assistModel.companyCode
          };
          this.caseAssistService.leaveCaseAssist(leaveData).subscribe(
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
  cancelleaveClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要取消留案的案件", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.$confirm("您确定取消留案吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let arr = this.selectionList.slice(0, this.selectionList.length);
        let amount = arr.map(v => {
          return v.assistId;
        });
        let cancelLeaveData: any = {
          caseIds: amount,
          companyCode: this.userData.companyCode || this.assistModel.companyCode
        };
        this.caseAssistService.cancelLeaveCaseAssist(cancelLeaveData).subscribe(
          data => {
            this.refreshData();
            this.$message({
              type: "success",
              message: `操作成功,剩余可取消留案数${data.caseNum}个!`
            });
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      });
    }
  }
  /**
   * 结束协催
   */
  assistEndClick(scope) {
    this.$confirm("确定要结束协催吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let assistData: any = {
          assistId: scope.row.assistId
        };
        this.caseAssistService.closeCaseAssist(assistData).subscribe(
          data => {
            this.refreshData();
            this.$message({
              type: "success",
              message: "操作成功!"
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
  /**
   * 案件分配
   */
  redistributeClick() {
    this.redialog.disabled = true;
  }
  /**
   * 获取催收专员案件数(批量分配)
   */
  loadData() {
    this.$nextTick(() => {
      let typeVisit = "xc";
      let refreshVisit: any = this.$refs["mass"];
      refreshVisit.refresh(typeVisit);
    });
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
          return v.assistId;
        });
        this.caseAssistService
          .assistCaseMarkColor({
            assistIds: amount,
            markId: this.caseMark
          })
          .subscribe(
            data => {
              this.caseMark = "";
              this.refreshData();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      }
    }
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  refreshData() {
    this.caseInfoInquiryService
      .getCaseAssistByCondition(
        this.assistModel,
        this.pageService,
        this.sortService
      )
      .subscribe(
        data => {
          this.assistDataSet = data;
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
