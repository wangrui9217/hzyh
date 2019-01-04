<template>
  <section class="page repair-review">
    <data-form :rules="callRule" :model="repairModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5251">
          <el-input v-model="repairModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="personalPhone" v-auth="5252">
          <el-input v-model="repairModel.personalPhone" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="批次号" prop="batchNumber" v-auth="5253">
          <el-input v-model="repairModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="还款类型" prop="payType" v-auth="5254">
          <el-select v-model="repairModel.payType" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0009')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="还款方式" prop="payWay" v-auth="5255">
          <el-select v-model="repairModel.payWay" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in $dict.getDictData('0010')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applyRealName" v-auth="5256">
          <el-input v-model="repairModel.applyRealName"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5257">
          <el-select v-model="repairModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in getPrincipalList()" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="exportrepaymentClick" v-auth="5258">导出还款记录</el-button>
      </template>
    </data-form>
    <data-box :data="repairDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column label="操作 " :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button @click="repairObj=scope.row,dialog.approval=true" type="text" v-if="scope.row.approveStatus===57" v-auth="5259">审核</el-button>
            <el-button @click="repairObj=scope.row,dialog.record=true" type="text" size="small" v-auth="5260">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="repairObj=scope.row;dialog.detail=true">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="personalPhone" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalPhone | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseAmt" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.caseAmt|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyPayAmt" label="还款金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.applyPayAmt|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDerateAmt" label="减免金额(元)" align="right" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{ scope.row.applyDerateAmt|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="还款类型" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.payType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payWay" label="还款方式" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.payWay | dictConvert }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="审核状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveResult" label="审核结果" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.approveResult === 180&&scope.row.payaOpinion" class="item" effect="light" :content="scope.row.payaOpinion" placement="bottom">
              <span style="color:red;cursor:pointer">{{scope.row.approveResult | dictConvert}}</span>
            </el-tooltip>
            <span v-else>{{scope.row.approveResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" sortable='custom' label="申请日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyRealName" label="申请人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="payMemo" label="还款说明" :min-width="$helper.getColumnWidth(4)" align="left" show-overflow-tooltip>
        </el-table-column>
        
      </template>
    </data-box>
    <!--还款审批-->
    <el-dialog title="还款审批" :center="true" :visible.sync="dialog.approval" width="70%" @open="$nextTick(()=>$refs['repair-approval'].refresh(repairObj.id))">
      <repair-approval ref="repair-approval" @checkImg="checkImg" @close="dialog.approval = false" @refreshList="refreshData"></repair-approval>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="repairObj.caseId"></case-detail>
    </el-dialog>
    <!--案件跟进明细-->
    <el-dialog :title="repairObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.record" width="90%">
      <follow-record :caseNumber="repairObj.caseNumber"></follow-record>
    </el-dialog>
    <!--查看凭证-->
    <el-dialog title="查看" :center="true" :visible.sync="dialog.img" width="60%">
      <div style="padding-bottom:20px;overflow:hidden">
        <el-col style="max-height:500px;overflow-x:auto;text-align:center">
          <img v-for="(v,i) in imgArr" :key="i" :src="v" width="500" style="padding-bottom:20px" v-img />
        </el-col>
      </div>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PaymentService } from "~/services/business-service/payment.service";
import { State, Getter } from "vuex-class";
import RepairApproval from "~/components/approval-manage/repair-review/repair-approval.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import { CommonService } from "~/utils/common.service";
import FollowRecord from "~/components/approval-manage/follow-record.vue";

@Auth(701)
@Layout("workspace")
@Component({
  components: {
    FollowRecord,
    DataForm,
    DataBox,
    RepairApproval,
    CaseDetail
  }
})
export default class RepairReview extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(PaymentService) private paymentService: PaymentService;

  @State userData: any;
  @State principalList: any;
  @Getter isSupperAdmin: boolean;
  /**
   * 委托方过滤
   */
  getPrincipalList() {
    return this.principalList.filter(
      x => x.companyCode === this.repairModel.companyCode
    );
  }
  // 电催表单验证规则
  private callRule = {
    personalPhone: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  @State companyList: any;
  private dataName: any = []; //委托方
  private repairModel: any = {
    companyCode: "",
    personalName: "",
    personalPhone: "",
    orderId: "",
    amtRange: { min: "", max: "" },
    principalId: "", // 委托方
    payType: "",
    applyRealName: "",
    payWay: "",
    batchNumber: "" // 批次号
  };
  private repairDataSet = null;
  private imgArr = [];
  private repairObj: any = {};
  private dialog: any = {
    detail: false,
    approval: false,
    record: false,
    img: false
  };
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.repairModel.companyCode = this.userData.companyCode;
    }
    return this.repairModel.companyCode;
  }

  set companyCode(value) {
    this.repairModel.companyCode = value;
  }

  checkImg(arr) {
    this.dialog.img = true;
    this.imgArr = arr;
  }
  /**
   * 导出还款记录
   */
  exportrepaymentClick() {
    this.paymentService.exportCasePayApply(this.repairModel).subscribe(
      data => {
        this.$message.info("操作成功，请关注任务中心！");
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  refreshData() {
    this.paymentService
      .getAllPayment(this.repairModel, this.pageService, { applyDate: "desc" })
      .subscribe(
        data => {
          this.repairDataSet = data;
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
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
}
</script>

<style lang="less">
</style>
