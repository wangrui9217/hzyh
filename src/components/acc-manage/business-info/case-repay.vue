<template>
  <section class="component case-repay">
    <data-form :model="repayModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="申请日期" prop="applyDate">
          <el-date-picker v-model="repayModel.applyDate" type="daterange" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="还款类型" prop="payType">
          <el-select v-model="repayModel.payType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0009')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核结果" prop="approveResult">
          <el-select v-model="repayModel.approveResult" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0013')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="approveStatus">
          <el-select v-model="repayModel.approveStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0012')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="endcaseClick">结案</el-button>
      </template>
    </data-form>

    <data-box :data="repayDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="applyDate" label="申请时间" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyPayAmt" label="还款金额(元)" :min-width="$helper.getColumnWidth(3)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.applyPayAmt|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="还款类型" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.payType|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDerateAmt" label="减免金额(元)" :min-width="$helper.getColumnWidth(3)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.applyDerateAmt|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payWay" label="还款方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.payWay|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveResult" label="审核结果" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.approveResult|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus|dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyRealName" label="申请人" :min-width="$helper.getColumnWidth(2)">
        </el-table-column>
        <el-table-column label="凭证" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-button @click="CheckVoucherClick(scope)" type="text">查看凭证</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--查看凭证-->
    <el-dialog title="查看" :center="true" :visible.sync="dialog.img" width="40%">
      <div style="padding-bottom:20px;overflow:hidden">
        <el-col style="max-height:500px;overflow-x:auto;text-align:center">
          <img v-for="(v,i) in imgArr" :key="i" :src="v" width="500" style="padding-bottom:20px" v-img />
        </el-col>
      </div>
    </el-dialog>
    <!--结案-->
    <el-dialog title="结案" :center="true" :visible.sync="dialog.endcase" :show-close="false">
      <EndCase @close="dialog.endcase=false"></EndCase>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State, Mutation, namespace } from "vuex-class";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { AccVisitPoolService } from "../../../services/business-service/acc-visit-pool.service";
import { CaseAssistService } from "../../../services/business-service/case-assist.service";
import { FilterService } from "~/utils/filter.service";
import { CommonService } from "~/utils/common.service";
import { Watch } from "vue-property-decorator";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import EndCase from "~/components/acc-manage/end-case.vue";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    EndCase
  }
})
export default class CaseRepay extends Vue {
  @accManageModule.State caseId;
  @accManageModule.State searchModel;
  @accManageModule.State assistId;
  @accManageModule.State repayRecordFlag;
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(AccVisitPoolService) private accVisitPoolService: AccVisitPoolService;
  @Dependencies(CaseAssistService) private caseAssistService: CaseAssistService;

  private repayDataSet: any = null;
  private imgArr = []
  private repayModel: any = {
    applyDate: ['', ''],
    payType: '',
    approveResult: '',
    approveStatus: '',
    payApplyId: ''
  }
  private dialog: any = {
    img: false,
    endcase: false
  }
  mounted() {
    this.refreshData();
  }
  @Watch("caseId")
  onCaseIdChange() {
    this.refreshData();
  }
  @Watch("repayRecordFlag")
  onRecordChange() {
    this.refreshData();
  }
  refreshData() {
    if (this.searchModel.collectionType === 15) {
      this.accTelPoolService
        .getPaymentRecord({
          caseId: this.caseId,
          applyDate: [FilterService.dateRanageFormat(this.repayModel.applyDate).start, FilterService.dateRanageFormat(this.repayModel.applyDate).end],
          payType: this.repayModel.payType,
          approveResult: this.repayModel.approveResult,
          approveStatus: this.repayModel.approveStatus
        }, this.pageService, { applyDate: 'desc' })
        .subscribe(
        data => {
          this.repayDataSet = data
        }, ({ msg }) => {
          this.$message.error(msg)
        })
    } else if (this.searchModel.collectionType === 16) {
      this.accVisitPoolService
        .getPaymentRecord({
          caseId: this.caseId,
          applyDate: [FilterService.dateRanageFormat(this.repayModel.applyDate).start, FilterService.dateRanageFormat(this.repayModel.applyDate).end],
          payType: this.repayModel.payType,
          approveResult: this.repayModel.approveResult,
          approveStatus: this.repayModel.approveStatus
        }, this.pageService, { applyDate: 'desc' })
        .subscribe(
        data => {
          this.repayDataSet = data
        }, ({ msg }) => {
          this.$message.error(msg)
        })
    } else if (this.searchModel.collectionType === 17) {
      this.caseAssistService
        .findAssistCasePayRecord({
          caseId: this.caseId,
          assistId: this.caseId,
          applyDate: [FilterService.dateRanageFormat(this.repayModel.applyDate).start, FilterService.dateRanageFormat(this.repayModel.applyDate).end],
          payType: this.repayModel.payType,
          approveResult: this.repayModel.approveResult,
          approveStatus: this.repayModel.approveStatus
        }, this.pageService, { applyDate: 'desc' })
        .subscribe(
        data => {
          this.repayDataSet = data
        }, ({ msg }) => {
          this.$message.error(msg)
        })
    }

  }
  /**
   * 结案
   */
  endcaseClick() {
    this.$confirm('案件结案后，将退出催收任务，您确定要结案吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.dialog.endcase = true
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消结案'
      })
    })
  }
  /**
   * 查看凭证
   */
  CheckVoucherClick(scope) {
    let urlArr = []
    this.accTelPoolService
      .getPayProof({
        casePayId: scope.row.id
      })
      .subscribe(data => {
        if (data.length === 0) {
          this.$message('该案件没有上传凭证！')
        } else {
          urlArr = data.filter((v, i) => {
            if (v.type === 'jpg' || v.type === 'png') {
              return true
            } else {
              CommonService.downloadFile(v.url, v.realName)
              return false
            }
          }).map(v => v.url)
        }
        if (urlArr.length > 0) {
          this.dialog.img = true
          this.imgArr = urlArr
        }
      }, ({ msg }) => {
        this.$message.error(msg)
      })
  }
  /**
   * 撤回
   */
  WithdrawClick(scope) {
    this.repayModel.payApplyId = scope.row.id
    this.$confirm('确定要撤回此条还款申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (this.searchModel.collectionType === 15) {
        this.accTelPoolService
          .telWithdraw({
            payApplyId: this.repayModel.payApplyId
          }).subscribe(data => {
            this.$message.success('案件已撤回')
            this.refreshData()
          }, ({ msg }) => this.$message.error(msg))
      } else if (this.searchModel.collectionType === 16) {
        this.accVisitPoolService
          .visitWithdraw({
            payApplyId: this.repayModel.payApplyId
          }).subscribe(data => {
            this.$message.success('案件已撤回')
            this.refreshData()
          }, ({ msg }) => this.$message.error(msg))
      } else if (this.searchModel.collectionType === 17) {
        this.caseAssistService
          .assistWithdraw({
            payApplyId: this.repayModel.payApplyId
          }).subscribe(data => {
            this.$message.success('案件已撤回')
            this.refreshData()
          }, ({ msg }) => this.$message.error(msg))
      }
    }).catch(() => {
      this.$message('已取消撤回')
    })
  }
  /**
   * 审批结果
   */
  CheckVoucherResult(scope) {

  }
}
</script>

<style lang="less" scoped>

</style>


