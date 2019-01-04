<template>
  <section class="page case-repair">
    <data-form :model="repairModel" @onSearch="refreshData">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5581">
          <el-input v-model="repairModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="委托方" prop="principalName" v-auth="5582">
          <el-select v-model="repairModel.principalName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in principalList" :key="index" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <div class="inline-box">
          <el-form-item label="逾期金额" prop="overdueAmount" v-auth="5583">
            <number-range v-model="repairModel.overdueAmount"> </number-range>
          </el-form-item>

        </div>
        <el-form-item label="逾期期数" prop="payStatus" v-auth="5584">
          <el-select v-model="repairModel.payStatus" placeholder="请选择" clearable>
            <el-option label="M0" value="M0"></el-option>
            <el-option label="M1" value="M1"></el-option>
            <el-option label="M2" value="M2"></el-option>
            <el-option label="M3" value="M3"></el-option>
            <el-option label="M4" value="M4"></el-option>
            <el-option label="M5" value="M5"></el-option>
            <el-option label="M6+" value="M6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="repairStatus" v-auth="5585">
          <el-select v-model="repairModel.repairStatus" placeholder="请选择" clearable>
            <el-option v-for="{value,label} in this.$dict.getDictData('0042')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overdueDays" v-auth="5586">
          <number-range v-model="repairModel.overdueDays" :isInteger="true"> </number-range>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchClick" v-auth="5587">批量分配</el-button>
      </template>
    </data-form>
    <data-box ref="data-box" :page="pageService" :selectionList.sync="selectionList" :data="repairDataSet" @onPageChange="refreshData">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
          <template slot-scope="scope">
            <span>{{scope.row.caseNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托方" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.principalName?scope.row.principalName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(3)">
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
        <el-table-column prop="overdueAmount" label="逾期金额(元)" :min-width="$helper.getColumnWidth(6)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="逾期期数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.payStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前催收员" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{ scope.row.collectorName? scope.row.collectorName:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="collectionStatus" label="状态" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span>{{scope.row.repairStatus | dictConvert}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="batchObj(scope.row)" v-auth="5600">案件分配</el-button>
            <el-button type="text" size="small" @click="repairObj = scope.row,dialog.showRepairDetailDialog = true" v-auth="5588">修复</el-button>
            <el-button type="text" size="small" @click="checkClick(scope)" v-auth="5589">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--案件分配弹出框-->

    <!--案件修复弹出框-->
    <el-dialog title="案件修复"  :visible.sync="dialog.showRepairDetailDialog">
      <upload-attachments @close="dialog.showRepairDetailDialog=false" ref="upload-attachments" :repairId="repairObj.caseRepairId" @refresh="refreshData()"></upload-attachments>
    </el-dialog>
    <!--选择催收机构或催收员-->
    <el-dialog title="请选择催收员" :center="true" :visible.sync="dialog.caseAllot" width="80%">
      <case-allot ref="case-allot" @close="dialog.caseAllot = false" @success="refreshData();dialog.caseAllot = false"></case-allot>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { State, Getter, namespace, Mutation } from "vuex-class";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import UploadAttachments from "~/components/repair-manage/upload-attachments.vue";
import CaseAllot from "~/components/case-info/case-allot.vue";
import NumberRange from "~/components/common/number-range.vue";
import { CaseRepairService } from "~/services/business-service/case-repair.service";
import { CaseInfoInquiryService } from "~/services/report-service/case-info-inquiry.service";
import { UserService } from "~/services/business-service/user.service";
import { CommonService } from "~/utils/common.service";

const inrushCaseModule = namespace("inrush-case");
@Auth(671)
@Layout("workspace")
@Component({
  components: {
    DataForm,
    DataBox,
    UploadAttachments,
    CaseAllot,
    NumberRange
  }
})
export default class CaseRepair extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseRepairService) private caseRepairService: CaseRepairService;
  @Dependencies(CaseInfoInquiryService)
  private caseInfoInquiryService: CaseInfoInquiryService;
  @Dependencies(UserService) private userService: UserService;
  @State principalList: any;
  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;
  @inrushCaseModule.Mutation updateSelectedCase;
  @inrushCaseModule.Mutation updateSelectedList;

  private repairModel: any = {
    overdueDays: {
      min: "",
      max: ""
    },
    companyCode: "",
    personalName: "", // 客户姓名
    principalName: "", // 委托方
    overdueAmount: {
      min: "",
      max: ""
    }, // 修复案件金额
    repairStatus: "", // 状态
    payStatus: "" // 逾期期数
  };
  private repairDataSet: Array<any> = [];
  private selectionList: any = [];
  private repairObj: any = {};
  private multipleSelection: any = {};
  private dialog: any = {
    showRepairDetailDialog: false,
    caseAllot: false
  };
  private UserNameData: any = [];
  private orgData: any = {};
  private caseDataId: any = [];
  private caseDataNum: any = [];
  private type: boolean = true;
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
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData();
    }
  }

  mounted() {
    this.refreshData();
  }
  caseList(caseIdList) {
    this.caseDataId = caseIdList;
  }
  caseNumList(caseNumList) {
    this.caseDataNum = caseNumList;
  }
  userNameList(userNameList) {
    this.UserNameData = userNameList;
  }
  batchDistributeClick() {}
  refreshData() {
    this.caseInfoInquiryService
      .getAllRepairingCase(this.repairModel, this.pageService)
      .subscribe(
        data => {
          this.repairDataSet = data;
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
      this.$message("请选择分案的案件!");
      return;
    }
    //选案获取案件id
    let caseIds: string[] = this.selectionList.map(v => v.caseId);
    //提交id到store
    this.updateSelectedCase(caseIds);
    this.updateSelectedList(this.selectionList);
    
    this.dialog.caseAllot = true;
  }
  batchObj(row) {
    //选案获取案件id
    let caseIds: string[] = [];
    caseIds.push(row.caseId);
    //提交id到store
    this.updateSelectedCase(caseIds,this.selectionList);
    this.dialog.caseAllot = true;
  }
  /**
   * 机构分配Open
   */
  orgOpen() {
    this.$nextTick(() => {
      let orgAllocate: any = this.$refs["organization-allocate"];
      orgAllocate.refresh(this.selectionList);
    });
  }
  /**
   * 用户分配Open
   */
  userOpen() {
    this.$nextTick(() => {
      let userflag: any = this.$refs["user-allocate"];
      userflag.refresh(this.multipleSelection);
    });
  }
  /**
   * 查看
   */
  checkClick(scope) {
    this.caseRepairService
      .viewCaseRepair({
        id: scope.row.caseId
      })
      .subscribe(
        data => {
          if (data && data.length > 0) {
            let downloadList = data.map(v => {
              return {
                url: v.fileUrl,
                filename: v.fileName ? v.fileName : new Date()
              };
            });
            CommonService.downloadAll(downloadList);
          } else {
            this.$message.info("该案件暂无修复信息");
          }
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
