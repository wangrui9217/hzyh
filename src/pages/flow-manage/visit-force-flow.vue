//外访强制流转
<template>
  <section class="page visit-force-flow">
    <data-form :model="visitForceModel" :rules="rules" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5233">
          <el-input v-model="visitForceModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5234">
          <el-input v-model="visitForceModel.personalPhone" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="逾期金额" prop="amtRange" v-auth="5235">
          <number-range v-model="visitForceModel.amtRange"></number-range>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-auth="5236">
          <el-input v-model="visitForceModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="5237">
          <number-range v-model="visitForceModel.overdueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="状态" prop="collectionStatus" v-auth="5238">
          <el-select v-model="visitForceModel.collectionStatus" placeholder="请选择" clearable>
            <el-option label="逾期还款中" :value="22"></el-option>
            <el-option label="提前结清还款中" :value="23"></el-option>
            <el-option label="部分已还款" :value="172"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方" v-auth="5239">
          <el-select v-model="visitForceModel.principalId" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属省份" prop="parentAreaId" v-auth="5240">
          <el-select v-model="visitForceModel['parentAreaId']" clearable>
            <el-option v-for="{value,label} in this.$city.getCityData({ level : 1 })" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属城市" prop="areaId" v-auth="5241">
          <el-select v-model="visitForceModel['areaId']" clearable>
            <el-option v-for="{value,label} in this.visitForceModel['parentAreaId'] ? this.$city.getCityData({ level: 1, id: this.visitForceModel['parentAreaId'] }) : []" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" v-auth="5242">
          <el-input v-model="visitForceModel.idCard"></el-input>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchClick" v-auth="5243">批量分配</el-button>
      </template>
    </data-form>
    <data-box :data="visitForceDataSet" :page="pageService" :selectionList.sync="selectionList" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="name" label="客户姓名" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.personalInfo.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalInfo.mobileNo" label="手机号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="personalInfo.idCard" label="身份证号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(4)" sortable='custom'>
        </el-table-column>
        <el-table-column prop="name" label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalId===null?"":scope.row.principalId.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="归属城市" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span>{{scope.row.area?scope.row.area.areaName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="circulationStatus" label="流转状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.circulationStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.collectionStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseFollowInTime" label="案件流入日期" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{(scope.row.caseFollowInTime?scope.row.caseFollowInTime: '')|dateFormat}}</span>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--批量分配-->
    <el-dialog title="请选择催收员" :center="true" :visible.sync="dialog.batchAllocate" width="70%" @open="$nextTick(() => { $refs['inrush-redistribute'].refresh() })">
      <inrush-redistribute ref="inrush-redistribute" @user="dialog.userBatchAllocate=true" @org="dialog.orgBatchAllocate=true" @close="dialog.batchAllocate=false"></inrush-redistribute>
    </el-dialog>
    <!--分配给用户-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.userBatchAllocate" width="70%" @open="userOpen">
      <redistributed-user @preStep="dialog.userBatchAllocate=false" @cancel="dialog.userBatchAllocate=false" @success="dialog.userBatchAllocate=false;dialog.batchAllocate=false;refreshData()" @errMsg="errMsgShow" ref="user-allocate" :typeId="typeId"></redistributed-user>
    </el-dialog>
    <!--分配给机构-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.orgBatchAllocate" width="70%" @open="orgOpen">
      <redistributed-org @preStep="dialog.orgReallocate=false" @cancel="dialog.orgBatchAllocate=false" @success="dialog.orgBatchAllocate=false;dialog.batchAllocate=false;refreshData()" ref="org-allocate" :typeId="typeId"></redistributed-org>
    </el-dialog>
    <!--案件分配失败-->
    <el-dialog title="案件分配失败" v-model="dialog.errMsgOpen" size="tiny" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <data-box :data="errMsgData">
        <template slot="columns">
          <el-table-column prop="errorMsg" label="错误提示" :min-width="$helper.getColumnWidth(4)">
          </el-table-column>
        </template>
      </data-box>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { State, Getter } from "vuex-class";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import NumberRange from "~/components/common/number-range.vue";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import InrushRedistribute from "~/components/inrushcase-manage/inrush-redistribute.vue";
import RedistributedUser from "~/components/inrushcase-manage/redistributed-user.vue";
import RedistributedOrg from "~/components/inrushcase-manage/redistributed-org.vue";

@Auth(966)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    InrushRedistribute,
    RedistributedUser,
    RedistributedOrg,
    NumberRange
  }
})
export default class VisitForceFlow extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  @State userData: any;
  @State principalList: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  private visitForceDataSet = null;
  private visitForceModel: any = {
    companyCode: "",
    personalName: "",
    personalPhone: "",
    batchNumber: "",
    orderId: "",
    amtRange: {
      min: "",
      max: ""
    },
    overdueDays: {
      min: "",
      max: ""
    },
    idCard: "",
    collectionStatus: "", //状态
    caseType: "", //流转状态
    principalId: "", // 委托方
    areaId: "" // 归属城市
  };

  private rules = {
    mobileNo: [{ validator: this.$validator.phoneNumber, trigger: "blur" }],
    idCard: [{ validator: this.$validator.idCard, trigger: "blur" }]
  };
  private selectionList: any = [];
  private dialog: any = {
    batchAllocate: false,
    userBatchAllocate: false,
    orgBatchAllocate: false,
    errMsgOpen: false
  };
  private typeId: any = 80;
  private errMsgData: any = [];
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.visitForceModel.companyCode = this.userData.companyCode;
    }
    return this.visitForceModel.companyCode;
  }

  set companyCode(value) {
    this.visitForceModel.companyCode = value;
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.caseInfoService
      .outForceCirculation(this.pageService, this.visitForceModel)
      .subscribe(
        data => (this.visitForceDataSet = data),
        err => this.$message.error(err.msg)
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
      return;
    }
    this.dialog.batchAllocate = true;
  }
  /**
   * 分配给催收员open
   */
  userOpen() {
    this.$nextTick(() => {
      let userAllocate: any = this.$refs["user-allocate"];
      userAllocate.refreshData(this.selectionList);
    });
  }
  /**
   * 分配给机构
   */
  orgOpen() {
    this.$nextTick(() => {
      let orgAllocate: any = this.$refs["org-allocate"];
      orgAllocate.refreshData(this.selectionList);
    });
  }
  /**
   * 错误信息弹出
   */
  errMsgShow(data) {
    this.dialog.errMsgOpen = true;
    this.errMsgData = data;
  }
}
</script>

<style lang="less">
</style>
