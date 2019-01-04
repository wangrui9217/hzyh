<template>
  <section class="component manual-distrubute">
    <el-form :model="manualModel" ref="form" label-width="90px" class="form">
      <el-form-item>
        <span style="color:#20a0ff;">当前已选择{{selectionList.length}}个案件，案件总金额￥{{overdueAmount | toThousands}}</span>
      </el-form-item>
      <el-form-item prop="type">
        <el-radio-group v-model="manualModel.type">
          <el-radio :label="0">分配到内催案件池</el-radio>
          <el-radio :label="1">分配到委外案件池</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-row style="text-align: center">
      <el-button @click="close" >取消</el-button>
      <el-button @click="submit" :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State } from "vuex-class";
import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
import { Emit, Prop } from "vue-property-decorator";
import { PageService } from "~/utils/page.service";
import { UserService } from "~/services/business-service/user.service";
import DataBox from "~/components/common/data-box.vue";
import DepartmentTree from "~/components/system-manage/department-tree.vue";

@Component({
  components: {
    DataBox,
    DepartmentTree
  }
})
export default class ManualDistrubute extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(CaseInfoDistributeService)
  private caseInfoDistributeService: CaseInfoDistributeService;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}
  @Prop() selectionList: any;

  private nowNode: any = null;
  private caseList: any = []; // 案件数组
  private userDataSet: Array<any> = [];
  private manualModel: any = {
    batchNum: "",
    closeDate: "",
    companyCode: "",
    type: ""
  };
  private submitLoading: Boolean = false;
  get overdueAmount() {
    let sum = this.selectionList
      .map(v => v.overdueAmount)
      .reduce((a, b) => a + b, 0)
      .toFixed(2);
    return sum;
  }
  /**
   * 选择点变化
   */
  getCheckedNodes(item) {
    this.nowNode = item;
    this.refreshData();
  }
  /**
   * 刷新
   */
  refresh(caseList) {
    this.caseList = caseList;
    // this.nowNode = null
    // let tree: any = this.$refs.tree
    // tree.reset()
  }
  /**
   * 刷新用户列表
   */
  refreshData() {
    this.userService
      .queryUserByDeptAndRole(
        {
          deptCode: this.nowNode.code
        },
        this.pageService
      )
      .subscribe(
        data => {
          this.userDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
  /**
   * 确定
   */
  submit() {
    let caseNumberList: any = this.selectionList.map(v => v.caseNumber);
    let paramData: any = {
      caseNumberList: caseNumberList,
      type: this.manualModel.type,
      closeDate: this.manualModel.closeDate
    };
    this.submitLoading = true;
    this.caseInfoDistributeService.manualAllocation(paramData).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.success("分配成功");
        this.refreshList();
        this.manualModel.type = "";
        this.close();
      },
      ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      }
    );
  }
  // commit() {
  //   if (!this.nowNode) {
  //     this.$message.error('请选择机构')
  //     return false;
  //   }
  //   let caseIdList = this.caseList.map(v => v.id)
  //   this.caseInfoDistributeService.distributeCeaseInfo({
  //     caseIdList: caseIdList,
  //     depIdList: [this.nowNode.id],
  //     disType: 0,
  //     caseNumList: [caseIdList.length]
  //   }).subscribe(data => {
  //     this.$message({
  //       message: '分配成功',
  //       type: 'success'
  //     })
  //     this.refreshList()
  //     this.close()
  //   }, ({
  //     msg
  //   }) => {
  //     this.$message.error(msg);
  //   })
  // }
}
</script>

<style lang="less" scoped>
</style>
