<template>
  <section class="page abnormal-case">
    <data-form :model="importModel" @onSearch="refreshData" :page="pageService" :rules="abnormalRule">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="personalName" v-auth="5393">
          <el-input v-model="importModel.personalName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobileNo" v-auth="5394">
          <el-input v-model="importModel.mobileNo" :maxlength="13"></el-input>
        </el-form-item>
      </template>
      <template slot="collapse-input">
        <el-form-item label="批次号" prop="batchNumber" v-auth="5395">
          <el-input v-model="importModel.batchNumber"></el-input>
        </el-form-item>
        <el-form-item label="逾期天数" prop="overDueDays" v-auth="5396">
          <number-range v-model="importModel.overDueDays" :isInteger="true"></number-range>
        </el-form-item>
        <el-form-item label="逾期金额" prop="overdueAmount" v-auth="5397">
          <number-range v-model="importModel.overdueAmount"></number-range>
        </el-form-item>
        <el-form-item label="委托方" prop="prinName" v-auth="5398">
          <el-select v-model="importModel.prinName" placeholder="请选择" clearable>
            <el-option v-for="{index,id,name} in getPrincipalList()" :key="index" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="batchDeletedClick" v-auth="5399">批量删除</el-button>
        <el-button @click="batchAdd" v-auth="5400">批量新增</el-button>
        <el-button type="text" @click="settingsClick" v-auth="5401">设置更新项</el-button>
      </template>
    </data-form>

    <data-box :data="importDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <el-table-column prop="caseNumber" label="申请号" :min-width="$helper.getColumnWidth(6)">
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="prinName" label="委托方" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="city" label="申请城市" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="personalName" label="客户姓名" :min-width="$helper.getColumnWidth(4)">
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.mobileNo| encryptPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="逾期期数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="overDueDays" label="逾期天数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.accountBalance | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueAmount|toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseHandNum" label="案件手数" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="commissionRate" label="佣金比例(%)" :min-width="$helper.getColumnWidth(5)">
        </el-table-column>
        <el-table-column prop="delegationDate" label="委案日期" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.delegationDate|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="closeDate" label="到期日期" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <span>{{scope.row.closeDate|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(8)">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addCaseClick(scope)" v-auth="5402">新增</el-button>
            <el-button type="text" size="small" @click="updateCaseClick(scope)" v-auth="5403">更新</el-button>
            <el-button type="text" size="small" @click="deleteCaseClick(scope)" v-auth="5404">删除</el-button>
            <el-button type="text" size="small" @click="checkCaseClick(scope)" v-auth="5405">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--案件分配弹框-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.manual" width="60%" @open="$nextTick(()=>$refs['manual-distrubute'].refresh(selectionList))">
      <manual-distrubute ref="manual-distrubute" @close="dialog.manual=false" @refreshList="refreshData"></manual-distrubute>
    </el-dialog>
    <!--策略分案结果-->
    <el-dialog title="策略分案结果" :center="true" :visible.sync="dialog.static" width="60%" @open="$nextTick(()=>$refs['static-allot'].refresh(staticData))">
      <static-allot ref="static-allot" @close="dialog.static=false" @refreshList="refreshData"></static-allot>
    </el-dialog>
    <!--案件详情-->
    <el-dialog title="案件详情" :center="true" :visible.sync="dialog.detail" width="100%" fullscreen>
      <case-detail :caseId="importObj.id"></case-detail>
    </el-dialog>
    <!--更新异常案件-->
    <el-dialog title="请选择需要更新的案件" :center="true" :visible.sync="dialog.update" width="50%" @open="loadCaseList">
      <update-case ref="update-case" @close="dialog.update=false" @success="dialog.update=false;refreshData()"></update-case>
    </el-dialog>
    <!--查看案件-->
    <el-dialog title="重复案件" :center="true" :visible.sync="dialog.repeat" width="70%">
      <data-box ref="databox" :data="repeatDataSet">
        <template slot="columns">
          <!--数据列区域-->
          <el-table-column prop="caseNumber" label="申请号" align="center" :min-width="$helper.getColumnWidth(6)">
          </el-table-column>
          <el-table-column prop="personalName" label="客户姓名" align="center" :min-width="$helper.getColumnWidth(4)">
            <template slot-scope="scope">
              <span>{{scope.row.personalInfo?scope.row.personalInfo.name:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobileNo" label="手机号" :min-width="$helper.getColumnWidth(7)">
            <template slot-scope="scope">
              <span>{{scope.row.personalInfo?scope.row.personalInfo.mobileNo:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" align="center" :min-width="$helper.getColumnWidth(6)">
            <template slot-scope="scope">
              <span>{{scope.row.personalInfo?scope.row.personalInfo.idCard:''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountBalance" label="账户余额(元)" :min-width="$helper.getColumnWidth(5)" align="right">
            <template slot-scope="scope">
              <span>{{ scope.row.accountBalance | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="overdueAmount" label="逾期金额(元)" align="right" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <span>{{ scope.row.overdueAmount|toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="overdueDays" label="逾期天数" :min-width="$helper.getColumnWidth(6)">
          </el-table-column>
          <el-table-column prop="batchNumber" label="批次号" :min-width="$helper.getColumnWidth(5)">
          </el-table-column>
          <el-table-column prop="repeatType" label="重案类型" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <span>{{ scope.row.repeatType?scope.row.repeatType:''}}</span>
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-dialog>
    <!--设置更新项-->
    <el-dialog title="设置更新项" :canter="true" :visible.sync="dialog.setItems" width="50%" @open="getUpdataData">
      <set-update-items ref="update" @close="dialog.setItems= false"></set-update-items>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import NumberRange from "~/components/common/number-range.vue";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { PageService } from "~/utils/page.service";
import { CaseDistributeService } from "~/services/report-service/case-distribute.service";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { CaseInfoExceptionService } from "~/services/business-service/case-info-exception.service";
import { State, Getter } from "vuex-class";
import StaticAllot from "~/components/case-import/undistributed-case/static-allot.vue";
import ManualDistrubute from "~/components/case-import/undistributed-case/manual-distrubute.vue";
import CaseDetail from "~/components/acc-manage/case-detail.vue";
import { UserActiveMqService } from "~/services/datasync-service/user-activemq.service";
import UpdateCase from "~/components/case-import/abnormal-case/update-case.vue";
import SetUpdateItems from "~/components/case-import/abnormal-case/set-update-items.vue";

@Auth(414)
@Layout('workspace')
@Component({
  components: {
    StaticAllot,
    ManualDistrubute,
    CaseDetail,
    DataForm,
    DataBox,
    NumberRange,
    UpdateCase,
    SetUpdateItems
  }
})
export default class AbnormalCase extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(CaseInfoExceptionService) private caseInfoExceptionService: CaseInfoExceptionService;
  @Dependencies(CaseInfoDistributeService) private caseInfoDistributeService: CaseInfoDistributeService;
  @Dependencies(UserActiveMqService) private userActiveMqService: UserActiveMqService;
  @State companyList: any;
  @State storeList: any;
  @State principalList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;

  private importModel: any = {
    exceptionFlag: 1,
    companyCode: '',
    personalName: '',
    mobileNo: '',
    batchNumber: '',
    overDueDays: [],
    overdueAmount: [],
    prinName: ''
  };
  // 表单验证规则
  private abnormalRule = {
    mobileNo: [{
      validator: this.$validator.phoneNumber,
      trigger: "blur"
    }]
  };
  private dialog: any = {
    detail: false,
    manual: false,
    static: false,
    update: false,
    repeat: false,
    setItems: false
  };
  private importObj: any = {};
  private importDataSet = null;
  private repeatDataSet = null;
  private selectionList: Array<any> = [];
  private staticData: any = [];
  private errId: any = '';
  /**
   * 考虑到非管理员不显示公司选择控件
   * get 操作的时候强制设置非管理员所在公司码
   */
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.importModel.companyCode = this.userData.companyCode
    }
    return this.importModel.companyCode
  }

  set companyCode(value) {
    this.importModel.companyCode = value
  }
  /**
   * 页面激活
   */
  activated() {
    if (!this.isSupperAdmin) {
      this.refreshData()
    }
  }

  /**
   * 过滤委托方
   */
  getPrincipalList() {
    return this.principalList.filter(x => x.companyCode === this.importModel.companyCode)
  }

  /**@argument
   * 手动分案
   */
  manualDistruibute() {
    if (this.selectionList.length === 0) {
      this.$message('请选择要分配的案件')
    } else {
      this.caseInfoExceptionService.checkExceptionCase().subscribe(data => {
        this.dialog.manual = true
      }, ({
          msg
        }) => {
          this.$message.error(msg);
        })
    }
  }
  /**
   * 新增
   */
  addCaseClick(scope) {
    this.$confirm('您确定要新增案件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.caseInfoExceptionService.addCaseInfoException(scope.row.id).subscribe(data => {
        this.$message({
          type: 'info',
          message: '操作成功！'
        })
        this.refreshData()
      }, ({
          msg
        }) => {
          this.$message.error(msg);
        });
    })
  }
  /**
   * 更新
   */
  updateCaseClick(scope) {
    this.dialog.update = true
    this.errId = scope.row.id
  }
  /**
   * 更新案件打开弹框事件
   */
  loadCaseList() {
    this.$nextTick(() => {
      let updateCase: any = this.$refs['update-case'];
      updateCase.refreshData(this.errId)
    })
  }
  /**
   * 删除
   */
  deleteCaseClick(scope) {
    this.$confirm('您确定要删除案件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.caseInfoExceptionService.deleteCaseInfoException(scope.row.id).subscribe(data => {
        this.$message({
          type: 'info',
          message: '删除成功！'
        })
        this.refreshData()
      }, ({
          msg
        }) => {
          this.$message.error(msg);
        });
    })
  }
  /**
   * 批量删除
   */
  batchDeletedClick() {
    if (this.selectionList.length === 0) {
      this.$message('请选择要删除的案件!')
      return
    }
    this.$confirm('您确定要删除此案件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let ids = this.selectionList.map(v => (
        v.id
      ))
      this.caseInfoExceptionService.batchDeleteCaseInfoException(ids).subscribe(data => {
        this.$message({
          type: 'info',
          message: '删除成功！'
        })
        this.refreshData()
      }, ({
          msg
        }) => {
          this.$message.error(msg);
        });
    })
  }
  /**
   * 批量新增
   */
  batchAdd() {
    if (this.selectionList.length === 0) {
      this.$message('请选择要新增的案件!')
      return
    }
    let removeId = this.selectionList.map(v => (
      v.id
    ))
    this.$confirm(`确定要新增这${this.selectionList.length}条案件吗?`,'提示',{
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'info'
    }).then(() => {
      this.caseInfoExceptionService.batchAddCaseInfo(removeId).subscribe(data => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
          this.refreshData()
        }, ({
          msg
        }) => {
          this.$message.error(msg);
      });
    })
    
  }
  /**
   * 查看
   */
  checkCaseClick(scope) {
    this.dialog.repeat = true;
    this.caseInfoExceptionService.getAllRepeatCaseInfo(scope.row.id).subscribe(data => {
      this.repeatDataSet = data.content;
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
  }
  /**
   * 策略分配点击
   */
  staticAllocatClick() {
    this.caseInfoExceptionService.checkExceptionCase().subscribe(data => {
      this.$confirm('您确定要策略分配吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.caseInfoDistributeService.countStrategyAllocation(this.importModel, this.selectionList.map(v =>
          v.id)).subscribe(data => {
            this.staticData = data.modelList;
            this.dialog.static = true
          }, ({
            msg
          }) => {
            this.$message.error(msg);
          });
      })
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      })
  }
  refreshData() {
    this.caseInfoExceptionService.findAllCaseInfoException(this.importModel, this.pageService).subscribe(data => {
      this.importDataSet = data;
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      });
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
  /**
   * 设置更新项
   */
  settingsClick() {
    // 检测是否管理员
    if (!this.isSupperAdmin) {
      // 不是管理员则赋值操作，因为用户不能看到公司选项
      this.importModel.companyCode = this.userData.companyCode
    }
    // 检测公司码是否成功设置
    if (this.importModel.companyCode) {
      this.dialog.setItems = true
    } else {
      this.$message('请选择公司名称')
    }
  }
  /**
   * 打开设置更新项弹框
   */
  getUpdataData() {
    this.$nextTick(() => {
      let updateItems: any = this.$refs['update'];
      updateItems.refreshData(this.importModel.companyCode);
    })
  }

  mounted() {
    if (!this.isSupperAdmin) {
      this.importModel.companyCode = this.userData.companyCode
      this.refreshData()
    }
  }
}

</script>

<style lang="less">

</style>
