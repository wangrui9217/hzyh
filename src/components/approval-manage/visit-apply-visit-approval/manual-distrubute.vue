<template>
  <section class="component manual-distrubute">
    <el-row type="flex">
      <el-col :span="6" style="height:500px;margin-top:4px;border:1px solid #d1dbe5;overflow:auto">
        <department-tree @onCurrentChange="getCheckedNodes" ref="tree"></department-tree>
      </el-col>
      <el-col :span="18">
        <data-box :page="pageService" :data="userDataSet" :selectionRow.sync="selectionRow" @onPageChange="refreshData" ref="data-box">
          <template slot="columns">
            <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="roleName" label="角色" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column  label="是否管理员" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope" >
                <span v-if="scope.row.manager===1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="所属机构" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
          </template>
        </data-box>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top:10px">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit" :loading="submitLoading">确定</el-button>
    </el-row>  
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Dependencies } from "~/core/decorator";
  import { State } from "vuex-class";
  import { CaseInfoDistributeService } from "~/services/business-service/case-info-distribute.service";
  import { Emit } from "vue-property-decorator";
  import { PageService } from "~/utils/page.service";
  import { UserService } from "~/services/business-service/user.service";
  import DataBox from "~/components/common/data-box.vue";
  import DepartmentTree from '~/components/system-manage/department-tree.vue'
  import { CaseOutboundApplyService } from "~/services/business-service/case-outbound-apply.service";

  @Component({
    components: {
      DataBox,
      DepartmentTree
    }
  })
  export default class ManualDistrubute extends Vue {
    @Dependencies(PageService) private pageService: PageService;
    @Dependencies(UserService) private userService: UserService;
    @Dependencies(CaseInfoDistributeService) private caseInfoDistributeService: CaseInfoDistributeService;
    @Dependencies(CaseOutboundApplyService) private caseOutboundApplyService: CaseOutboundApplyService;
    @Emit('refreshList')
    refreshList(){}
    @Emit('close')
    close(){}
    private approvalModel: any = {};
    private selectionRow: any = {};
    private nowNode: any = null;
    private caseList: any = []; // 案件数组
    private userDataSet: Array < any > = [];
    private submitLoading: Boolean = false;

    /**
     * 选择点变化
     */
    getCheckedNodes(item) {
      this.nowNode = item;
      this.refreshData()
    }
    /**
     * 刷新
     */
    refresh(obj, approvalModel){
      this.approvalModel = approvalModel
      this.approvalModel.id = obj.id
      this.selectionRow = {}
      this.nowNode = null
      let tree: any = this.$refs.tree
      tree.reset()
    }
    /**
     * 刷新用户列表
     */
    refreshData() {
      this.userService.getUserByType({ deptCode: this.nowNode.code, type: 2 }, this.pageService).subscribe(data => {
        this.userDataSet = data;
      }, ({ msg }) => {
        this.$message.error(msg);
      })
    }
    /**
     * 确定
     */
    commit(){
      if(!this.selectionRow || !this.selectionRow.id) {
        this.$message('请选择催收员')
        return false;
      }
      this.submitLoading = true;
      this.approvalModel.currentCollector = this.selectionRow.id
      this.caseOutboundApplyService.visitApplyVisitApprove(this.approvalModel).subscribe(data => {
        this.$message.success('操作成功!')
        this.submitLoading = false;
        this.refreshList()
      }, ({ msg }) => {
        this.$message.error(msg);
        this.submitLoading = false;
      });
      
      // this.caseInfoDistributeService.distributeCeaseInfo({ caseIdList: caseIdList, depIdList: [this.nowNode.id], disType: 0, caseNumList: [caseIdList.length] }).subscribe(data => {
      //   this.$message({
      //     message: '分配成功',
      //     type: 'success'
      //   })
      //   this.refreshList()
      //   this.close()
      // }, ({ msg }) => {
      //   this.$message.error(msg);
      // })
    }
  }
</script>

<style lang="less" scoped>

</style>
