<template>
  <section class="component redistributed-user">
    <el-col class="el-alert el-alert--info" style="margin-bottom:20px">
      <el-col class="el-alert__content">
        <span class="el-alert__title">当前已选择{{selectionList.length}}个案件，已分配案件{{allocated}}个，还剩余{{selectionList.length-allocated}}个案件待分配。</span>
      </el-col>
    </el-col>
    <data-box :data="cupor" height="400">
      <template slot="columns">
        <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column prop="collector" label="当前催收员" :min-width="$helper.getColumnWidth(3)"></el-table-column>
        <el-table-column prop="caseCount" label="当前持有案件数" :min-width="$helper.getColumnWidth(4)"></el-table-column>
        <el-table-column label="确认分配案件数" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <el-input :min="0" size="small" type="number" :maxlength="2" class="batch" v-model="scope.row.distributionCount" :max="inputMax(scope)" @focus="inputFocus(scope)" @blur="batchInputChange(scope)">
            </el-input>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <el-col class="btns" style="padding:10px;text-align:center">
      <el-button @click="userPreStep">上一步</el-button>
      <el-button @click="close">取消</el-button>
      <el-button @click="userConfirm" :loading="submitLoading">确定</el-button>
    </el-col>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Layout, Dependencies } from "~/core/decorator";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import DataBox from "~/components/common/data-box.vue";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";

const accManageModule = namespace('inrush-case')

@Component({
  components: {
    DataBox
  }
})
export default class RedistributedUser extends Vue {
  @Dependencies(CaseInfoDistributeService) private caseInfoDistributeService: CaseInfoDistributeService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;

  @accManageModule.State('caseAllotUser') caseAllotUser

  private cupor: any = [];
  private selectionList: Array<any> = [];
  private isDebt: any = '';
  private isNumAvg: any = '';
  private allocated: any = '';
  private caseIds: any = [];
  private userIdList: any = [];
  private submitLoading: Boolean = false;

  @Emit('preStep')
  preStep() { }
  @Emit('cancel')
  cancel() { }
  @Emit('success')
  success() { }
  @Emit('errMsg')
  errMsg(msg) { }
  @Prop() typeId: any;

  created() {

  }
  mounted() {

  }
  refreshData(multipleSelection) {
    this.updateAllocated()
    this.selectionList = multipleSelection
    let userIds = this.caseAllotUser.map(v => {
      return v.id
    })
    this.caseInfoDistributeService.getUserInfoByUserId(userIds).subscribe(data => {
      if (data) {
        data = data.map(x => {
          x.distributionCount = 0
          return x
        })
        this.cupor = data
      } else {
        this.cupor = []
      }
    }, ({
        msg
      }) => {
        this.$message.error(msg);
      })
  }
  userPreStep() {
    this.preStep()
  }
  close() {
    this.cancel()
  }
  userConfirm() {
    let caseIdList = this.selectionList.map(v => {
      return v.caseId || v.id
    })
    let caseNumList = this.cupor.map(v => {
      return v.distributionCount
    })
    for (let j = 0; j < caseNumList.length; j++) {
      if (caseNumList[j] === '') {
        caseNumList[j] = '0'
      }
    }
    let userNameList = this.cupor.map(v => {
      return v.userName
    })
    let userIdList = this.cupor.map(v => {
      return v.userId
    })
    let result = 0
    for (let i = 0; i < caseNumList.length; i++) {
      result = result + caseNumList[i]
    }
    if (result <= 0) {
      this.$message('请确认分配案件数！')
      return
    }
    let distributeModel: any = {
      caseIdList: caseIdList,
      caseNumList: caseNumList,
      userIdList: userIdList,
      disType: 1,
      isPlan: 0
      // accReceivePoolModels: this.deptdata
    }
    this.submitLoading = true;  
    if (this.typeId === 80) {
      this.accTelPoolService.distributeTurnCeaseAgain(distributeModel).subscribe(data => {
        this.submitLoading = false;
        this.$message.success('分配成功！')
        this.success()
      }, ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      })
    } else {
      this.caseInfoService.distributeCeaseInfoAgain(distributeModel).subscribe(data => {
        this.submitLoading = false;
        this.$message.success('分配成功！')
        this.success()
      }, ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      })
    }
  }
  /**
   * 批量分配输入获取焦点
   */
  inputFocus(scope) {
    this.cupor[scope.$index].distributionCount = 0
    this.updateAllocated()
  }
  /**
   * 更新allocated
   */
  updateAllocated() {
    let sum = 0
    for (let v = 0; v < this.cupor.length; v++) {
      sum = sum + (isNaN(parseInt(this.cupor[v].distributionCount)) ? 0 : parseInt(this.cupor[v].distributionCount))
    }
    this.allocated = sum
  }
  /**
   * 输入框输入改变
   */
  batchInputChange(scope) {
    let item = this.cupor[scope.$index].distributionCount
    if (item < 0) {
      item = 0
    } else {
      let max = this.inputMax(scope)
      if (item > max) {
        item = max
      }
    }
    this.cupor[scope.$index].distributionCount = item
    this.updateAllocated()
  }
  /**
   * 输入框最大值
   */
  inputMax(scope) {
    let max = ((this.selectionList.length - this.allocated) > 0) ? (this.selectionList.length - this.allocated) :
      0
    return max
  }

}

</script>
<style>
.redistributed-user .el-alert--info {
  background-color: #50bfff;
  color: #ffffff;
  text-align: center;
}

.redistributed-user .el-checkbox__label {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 12px;
}

.redistributed-user .el-radio__label {
  font-size: 12px;
  padding-left: 10px;
}
</style>
