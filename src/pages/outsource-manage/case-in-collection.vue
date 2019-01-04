<template>
  <section class="page case-in-collection">
    <data-form :model="incollectionModel" @onSearch="refreshData" :buttonWrap="true">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5432">
          <el-input v-model="incollectionModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="受托方" prop="outsId" v-auth="5433">
          <el-select v-model="incollectionModel.outsId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,outsName} in getOutSourceList()" :key="index" :label="outsName" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="append">
        <el-radio-group v-model="incollectionModel.type" @change="refreshData">
          <el-radio :label="2">按受托方展示</el-radio>
          <el-radio :label="1">按批次展示</el-radio>
        </el-radio-group>
      </template>
      <template slot="default-button">
        <el-button @click="dialog.export=true" v-auth="5437">导出案件</el-button>
        <el-button @click="exportRecordClick" v-auth="5438">导出跟进记录</el-button>
        <!-- <el-button @click="dialog.import=true" v-auth="5439">导入跟进记录</el-button>
        <el-button @click="downloadfollowClick" type="text" v-auth="5440">下载跟进记录导入模版</el-button> -->
        <el-button @click="dialog.set = true" type="text" v-auth="5441">设置导出项</el-button>
      </template>
    </data-form>
    <data-box :page="pageService" :selectionList.sync="selectionList" :data="incollectionDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-button @click="dialog.check=true, collectObj=scope.row" type="text" v-auth="5442">案件明细</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="outsName" label="受托方" :min-width="$helper.getColumnWidth(5)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="comeOutsourceTime" label="案件流入时间" :min-width="$helper.getColumnWidth(6)" v-if="incollectionModel.type===1">
          <template slot-scope="scope">
            <span>{{scope.row.comeOutsourceTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(6)" v-if="incollectionModel.type===1">
        </el-table-column>
        <el-table-column prop="outcaseTotalCount" label="案件数量" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.overdueAmount|toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已催回案件数/比例" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            {{scope.row.outcaseClosedCount}}
            <em>/</em>
            {{scope.row.outcaseCountRate | toPercent}}
          </template>
        </el-table-column>
        <el-table-column label="已催回案件金额/比例" align="right" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            {{scope.row.outcaseClosedAmt|toThousands}}
            <em>/</em>
            {{scope.row.outcaseAmtRate | toPercent}}
          </template>
        </el-table-column>

      </template>
    </data-box>
    <!--设置导出项-->
    <el-dialog title="设置导出项" :visible.sync="dialog.set" width="50%" :center="true" @open="$nextTick(()=>$refs['set-export-items'].checkExportItems())">
      <set-export-items ref="set-export-items" :allData="setExport.allData" :category="setExport.category" @close="dialog.set=false" :exportVeidoo="setExport.exportVeidoo" :type="true"></set-export-items>
    </el-dialog>
    <!--选择导出案件-->
    <el-dialog title="选择导出案件" :center="true" :visible.sync="dialog.export" width="90%" @open="$nextTick(()=>$refs['export-case'].refresh(incollectionModel,selectionList))">
      <export-case ref="export-case" @close="dialog.export = false"></export-case>
    </el-dialog>
    <!--导入跟进记录-->
    <el-dialog title="导入跟进记录" :center="true" :visible.sync="dialog.import" width="80%" @open="$nextTick(()=>$refs['import-record'].refresh(incollectionModel,selectionList))">
      <import-record ref="import-record" @close="dialog.import = false" @refreshList="refreshData"></import-record>
    </el-dialog>
    <el-dialog :center="true" :visible.sync="dialog.check" width="100%" @open="$nextTick(()=>$refs['check-case-info'].refresh(collectObj))" :close-on-click-modal="false">
      <!--<div style="font-weight:bold;text-align:center;font-size:16px;margin-bottom:20px">{{collectObj.batchNumber}}批次案件明细</div>-->
      <div style="font-weight:bold;text-align:center;font-size:16px;margin-bottom:20px">案件明细</div>
      <div class="text-left" style="margin-bottom:20px;margin-left:10px">委外中案件数量：
        <span style="margin-right:30px">{{collectObj.currentOutsourceCount}}</span>委外中案件总金额：
        <span style="margin-right:30px">{{collectObj.currentOutsourceAmt}}</span> 已催回案件数：
        <span style="margin-right:30px">{{collectObj.outcaseClosedCount}}</span>已催回案件金额：
        <span style="margin-right:30px">{{collectObj.outcaseClosedAmt}}</span>
        <span v-if="incollectionModel.type===1">剩余委托天数：
          <span>{{collectObj.leftDay}}</span>天</span>
      </div>
      <check-case-info @refreshList="refreshData" @close="dialog.check = false" ref="check-case-info"></check-case-info>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { CommonService } from "~/utils/common.service";
import { QueryOutsourcePoolService } from "~/services/report-service/query-outsource-pool.service";
import { OutsourcePoolService } from "~/services/business-service/outsource-pool.service";
import { ExportOutsourceFollowupService } from "~/services/report-service/export-outsource-followup.service";
import ExportCase from "~/components/outsource-manage/case-in-collection/export-case.vue";
import { ProductSeriesService } from "~/services/business-service/product-series.service";
import ImportRecord from "~/components/outsource-manage/case-in-collection/import-record.vue";
import SetExportItems from "~/components/outsource-manage/case-in-collection/set-export-items.vue";
import CheckCaseInfo from "~/components/outsource-manage/case-in-collection/check-case-info.vue";

@Auth(524)
@Layout("workspace")
@Component({
  components: {
    CheckCaseInfo,
    SetExportItems,
    ImportRecord,
    ExportCase,
    DataForm,
    DataBox
  }
})
export default class CaseInCollection extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(QueryOutsourcePoolService)
  private queryOutsourcePoolService: QueryOutsourcePoolService;
  @Dependencies(OutsourcePoolService)
  private outsourcePoolService: OutsourcePoolService;
  @Dependencies(ExportOutsourceFollowupService)
  private exportOutsourceFollowupService: ExportOutsourceFollowupService;
  @Dependencies(ProductSeriesService)
  private productSeriesService: ProductSeriesService;

  @State userData: any;
  @State companyList: any;
  @State outSourceList: any;
  @Getter isSupperAdmin: boolean;

  private incollectionModel: any = {
    companyCode: "",
    batchNumber: "",
    outsId: "",
    outTime: [],
    overOutsourceTime: [],
    type: 1
  };

  private setExport: any = {
    allData: {
      basicOptions: [
        "客户姓名",
        "身份证号",
        "省份",
        "城市",
        "手机号码",
        "身份证户籍地址",
        "家庭地址",
        "固定电话",
        "婚姻状况"
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
        "案件批次号",
        "产品名称",
        "合同编号",
        "合同金额",
        "逾期总金额(元)",
        "剩余本金(元)",
        "逾期本金(元)",
        "逾期利息(元)",
        "还款期数",
        "每期还款日",
        "逾期期数",
        "逾期天数",
        "已还款金额",
        "已还款期数",
        "剩余天数",
        "还款状态",
        "委托方",
        "催收状态",
        "佣金比例(%)",
        "贷款日期",
        "逾期管理费",
        "催收反馈",
        "委外回款金额(元)",
        "委外案件金额(元)",
        "委外到期日期",
        "委外佣金比例(%)",
        "委外批次号",
        "委外方",
        "剩余金额(元)",
        "剩余委托时间(天)",
        "委案日期",
        "结案日期"
      ],
      openAccountOptions: ["还款卡银行", "还款卡号"],
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
    },
    category: 4,
    exportVeidoo: 4
  };
  private incollectionDataSet: Array<any> = [];
  private selectionList: any = [];
  private collectObj: any = {};
  private dialog: any = {
    export: false,
    import: false,
    set: false,
    check: false
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.incollectionModel.companyCode = this.userData.companyCode;
    }
    return this.incollectionModel.companyCode;
  }

  set companyCode(value) {
    this.incollectionModel.companyCode = value;
  }
  /**
   * 下载跟进记录导入
   */
  downloadfollowClick() {
    this.outsourcePoolService.loadTemplate(1).subscribe(
      data => {
        CommonService.downloadFile(data, "跟进记录导入模板");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  /**
   * 导出跟进记录
   */
  exportRecordClick() {
    let batchNumberList = [];
    if (this.incollectionModel.type === 1) {
      batchNumberList = this.selectionList.map(v => {
        return v.batchNumber;
      });
    }
    let outsIdList = this.selectionList.map(v => {
      return v.outsId;
    });
    this.exportOutsourceFollowupService
      .exportOutsourceFollowupRecord(
        this.incollectionModel,
        1,
        batchNumberList,
        outsIdList,
        []
      )
      .subscribe(
        data => {
          this.$message.info("操作成功，请关注任务中心！");
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 撤销分案
   */
  revertCaseAllot(scope) {
    this.$confirm("您确定要撤销分配吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.outsourcePoolService
          .revertOutCaseInfoDistribute(scope.row.batchNumber)
          .subscribe(
            data => {
              this.$message.info("操作成功！");
              this.refreshData();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      })
      .catch(() => {
        this.$message("已取消");
      });
  }
  refreshData() {
    this.queryOutsourcePoolService
      .queryAllOutsourcePool(this.incollectionModel, this.pageService)
      .subscribe(
        data => {
          this.incollectionDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
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
   * 过滤受托方
   */
  getOutSourceList() {
    return this.outSourceList.filter(
      x => x.companyCode === this.incollectionModel.companyCode
    );
  }
}
</script>

<style lang="less">
</style>
