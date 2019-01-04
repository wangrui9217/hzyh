<template>
  <section class="component choose-org">
    <div style="margin-bottom:15px" class="text-left">
      <span>类型：</span>
      <el-radio-group v-model="allotType">
        <el-radio :label="1">选择催收员</el-radio>
        <el-radio :label="0">选择机构</el-radio>
      </el-radio-group>
    </div>
    <el-row type="flex">
      <el-col :span="6" style="height:500px;margin-top:4px;border:1px solid #d1dbe5;overflow:auto">
        <department-tree @onCurrentChange="getCheckedNodes" ref="tree"></department-tree>
      </el-col>
      <el-col :span="18">
        <data-box :page="pageService" :data="userDataSet" @onPageChange="refreshData" :selectionRow.sync="selectionRow" ref="data-box">
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
import DepartmentTree from "~/components/system-manage/department-tree.vue";

@Component({
  components: {
    DataBox,
    DepartmentTree
  }
})
export default class ChooseOrg extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(CaseInfoDistributeService)
  private caseInfoDistributeService: CaseInfoDistributeService;
  @Emit("success")
  success(node, row, allotType) {}
  @Emit("close")
  close() {}

  private selectionRow: any = {};
  private nowNode: any = null;
  private allotType: any = 1;
  private userDataSet: Array<any> = [];
  private submitLoading: Boolean = false;
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
  refresh() {
    this.allotType = 1;
    this.nowNode = null;
    this.selectionRow = null;
    let tree: any = this.$refs.tree;
    tree.reset();
  }
  /**
   * 刷新用户列表
   */
  refreshData() {
    this.selectionRow = null;
    this.userService
      .queryUserByDeptAndRole({ deptCode: this.nowNode.code }, this.pageService)
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
  commit() {
    if (!this.nowNode) {
      this.$message("请选择机构");
      return false;
    }
    if (this.allotType && !this.selectionRow) {
      this.$message("请选择催收员");
      return false;
    }
    this.submitLoading = true;
    this.success(this.nowNode, this.selectionRow, this.allotType);
    this.submitLoading = false;
  }
}
</script>

<style lang="less" scoped>
</style>
