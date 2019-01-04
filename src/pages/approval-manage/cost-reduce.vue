<template>
  <section class="page cost-reduce">
    <data-form :rules="callRule" :model="costModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5244">
          <el-input v-model="costModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="personalPhone" v-auth="5245">
          <el-input v-model="costModel.personalPhone" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="批次号" prop="batchNumber" v-auth="5246">
          <el-input v-model="costModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="减免费用" prop="amtRange" v-auth="5247">
          <number-range v-model="costModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="委托方" prop="principalId" v-auth="5248">
          <el-select v-model="costModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in getPrincipalList()" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="costDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
         <el-table-column label="操作 " :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button @click="costObj=scope.row,dialog.approval=true" type="text" size="small" v-if="scope.row.approveStatus === 55" v-auth="5249">审批</el-button>
            <el-button @click="costObj=scope.row,dialog.record=true" type="text" size="small" v-auth="5250">跟进记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="costObj=scope.row;dialog.detail=true">{{scope.row.caseNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="principalName" label="委托方" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="personalPhone" label="手机号" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.personalPhone | encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="还款状态" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.approveStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDerateAmt" label="减免费用(元)" align="right" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.applyDerateAmt|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="减免类型" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.payType | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveResult" label="审批结果" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.approveResult === 54&&scope.row.orapOpinion" class="item" effect="light" :content="scope.row.orapOpinion" placement="bottom">
              <span style="color:red;cursor:pointer">{{scope.row.approveResult | dictConvert}}</span>
            </el-tooltip>
            <span v-else>{{scope.row.approveResult | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyDate" sortable='custom' label="申请日期" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.applyDate|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyRealName" label="申请人" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
       
      </template>
    </data-box>
    <!--减免审批-->
    <el-dialog title="减免审批" :center="true" :visible.sync="dialog.approval" width="70%" @open="$nextTick(()=>$refs['cost-approval'].refresh(costObj.id))">
      <cost-approval ref="cost-approval" @checkImg="checkImg" @close="dialog.approval = false" @refreshList="refreshData"></cost-approval>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="costObj.caseId" :orderId="costObj.orderId"></case-detail>
    </el-dialog>
    <!--案件跟进明细-->
    <el-dialog :title="costObj.caseNumber+'案件跟进明细'" :center="true" :visible.sync="dialog.record" width="90%">
      <follow-record :caseNumber="costObj.caseNumber"></follow-record>
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
import CostApproval from "~/components/approval-manage/cost-reduce/cost-approval.vue";
import NumberRange from "~/components/common/number-range.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import FollowRecord from "~/components/approval-manage/follow-record.vue";

@Auth(692)
@Layout("workspace")
@Component({
  components: {
    FollowRecord,
    DataForm,
    DataBox,
    NumberRange,
    CostApproval,
    CaseDetail
  }
})
export default class CostReduce extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(PaymentService) private paymentService: PaymentService;
  @State userData: any;
  @State companyList: any;
  @State principalList: any;
  @Getter isSupperAdmin: boolean;
  /**
   * 委托方过滤
   */
  getPrincipalList() {
    return this.principalList.filter(
      x => x.companyCode === this.costModel.companyCode
    );
  }
  private dataName: any = []; //委托方
  private costModel: any = {
    companyCode: "",
    personalName: "",
    personalPhone: "",
    orderId: "",
    amtRange: { min: "", max: "" },
    principalId: "",
    // 批次号
    batchNumber: ""
  };
  // 电催表单验证规则
  private callRule = {
    personalPhone: [{ validator: this.$validator.phoneNumber, trigger: "blur" }]
  };
  private costDataSet = null;
  private costObj: any = {};
  private imgArr = [];
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
      this.costModel.companyCode = this.userData.companyCode;
    }
    return this.costModel.companyCode;
  }

  set companyCode(value) {
    this.costModel.companyCode = value;
  }
  checkImg(arr) {
    this.dialog.img = true;
    this.imgArr = arr;
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  refreshData() {
    this.paymentService
      .getAllDerate(this.costModel, this.pageService, { applyDate: "desc" })
      .subscribe(
        data => {
          this.costDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
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
