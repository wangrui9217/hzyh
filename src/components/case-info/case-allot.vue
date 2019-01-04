<template>
  <section class="component case-allot">
    <div style="margin-bottom:15px" class="text-left">
      <span>分配方式：</span>
      <el-radio-group v-model="allotType" @change="changeTitle">
        <el-radio :label="1">按催收员分配</el-radio>
        <el-radio :label="0">按机构分配</el-radio>
      </el-radio-group>
    </div>
    <el-row type="flex">
      <el-col :span="6" style="height:500px;margin-top:4px;border:1px solid #d1dbe5;overflow:auto">
        <department-tree ref="department-tree" @onCurrentChange="getCheckedNodes"></department-tree>
      </el-col>
      <el-col :span="18">
        <data-form :model="model" @onSearch="refreshData" :page="pageService">
          <template slot="default-input">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="model.realName"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleName">
              <el-input v-model="model.roleName"></el-input>
            </el-form-item>
          </template>
        </data-form>
        <data-box :page="pageService" :selectionList.sync="display" :data="userDataSet" @onPageChange="refreshData" ref="data-box">
          <template slot="columns">
            <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
            </el-table-column>
            <el-table-column prop="roles" label="角色" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                {{scope.row.roles[0]?scope.row.roles[0].name:""}}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="催收类型" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">{{scope.row.type|dictConvert}}</template>
            </el-table-column>
            <el-table-column label="是否管理员" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <span v-if="scope.row.manager===1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="所属机构" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                {{scope.row.department.name?scope.row.department.name:""}}
              </template>
            </el-table-column>
          </template>
        </data-box>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top:10px">
      <el-button @click="nextStep">下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-row>

    <!--分配给催收员-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.userAllocate" @open="userOpen" width="80%" append-to-body>
      <user-allocate ref="user-allocate" @preStep="closeDialog()" @close="onclose()" @success="onSuccess()"></user-allocate>
    </el-dialog>
    <!--分配给催收机构-->
    <el-dialog title="案件分配" :center="true" :visible.sync="dialog.orgAllocate" @open="orgOpen" width="80%" append-to-body>
      <org-allocate ref="org-allocate" @preStep="closeDialog()" @close="onclose()" @success="onSuccess()"></org-allocate>
    </el-dialog>

  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { UserService } from "~/services/business-service/user.service";
import { CaseInfoService } from "~/services/business-service/case-info.service";
import DataBox from "~/components/common/data-box.vue";
import DataForm from "~/components/common/data-form.vue";
import DepartmentTree from "~/components/system-manage/department-tree.vue";
import UserAllocate from "~/components/case-info/case-allot/user-allocate.vue";
import OrgAllocate from "~/components/case-info/case-allot/org-allocate.vue";

const inrushCaseModule = namespace("inrush-case");
@Component({
  components: {
    DataBox,
    DataForm,
    DepartmentTree,
    UserAllocate,
    OrgAllocate
  }
})
export default class CaseAllot extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(CaseInfoService) private caseInfoService: CaseInfoService;

  @inrushCaseModule.State("caseAllotUser") caseAllotUser;
  @inrushCaseModule.State("caseAllotOrg") caseAllotOrg;
  @inrushCaseModule.Mutation("updateCaseAllotUser") updateCaseAllotUser;
  @inrushCaseModule.Mutation("updateCaseAllotOrg") updateCaseAllotOrg;

  @Emit("close")
  onclose() {
    let databox: any = this.$refs["data-box"];
    databox.clearSelection();
    this.closeDialog()
  }
  @Emit('parentTitle')
  parentTitle(value) {}
  @Emit("success")
  onSuccess() {
    this.onclose()
  }
  @Prop() modelType

  private allotType: any = "";
  private selectionList: any = [];
  private userDataSet: Array<any> = [];
  private nowNode: any = null;
  private dialog: any = {};
  private model: any = {};

  get display() {
    let c: any = this.allotType === 0 ? "" : this.selectionList;
    return c;
  }
  set display(v) {
    this.selectionList = v;
  }


  created() {
    this.allotType = 1;
    this.dialog = {
      userAllocate: false,
      orgAllocate: false
    }

    this.model = {
      realName: '',
      roleName: '',
      deptCode: '',
      modelType: []
    }
  }

/**
 * 关闭模态框
*/
  closeDialog() {
    this.dialog.userAllocate = false
    this.dialog.orgAllocate = false
  }
  /**
   * 改变title
   */
  changeTitle(val) {
    this.parentTitle(val)
  }
  /**
   * 刷新数据
  */
  refreshData() {
    this.model.modelType = this.modelType || ''
    this.userService.queryUserByDeptAndType(this.model, this.pageService)
      .subscribe(
      data => this.userDataSet = data,
      err => this.$message.error(err.msg)
      );
    
  }
  getCheckedNodes(item) {
    //选择树形结构中的数据（电催或外访）
    this.nowNode = item;
    this.model.deptCode = item.code;
    this.refreshData();
  }
  /**
   * 下一步，进入分配确认阶段
  */
  nextStep() {
    if (!this.nowNode) {
      this.$message('请选择催收员或者机构')
      return false;
    }
    if (!this.selectionList.length && this.allotType) {
      this.$message('请选择催收员或者机构')
      return false;
    }
    if (this.allotType) {
      this.$confirm("是否将案件分配给所选催收员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let userIdList = this.selectionList.map(v => v.id)
        this.updateCaseAllotUser(userIdList)
        this.dialog.userAllocate = true
      });
    } else {
      this.$confirm("是否将案件分配给所选机构?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.updateCaseAllotOrg(this.nowNode)
        this.dialog.orgAllocate = true
      })
    }
  }

  cancel() {
    let databox: any = this.$refs["data-box"];
    databox.clearSelection();
    this.onclose();
  }

  /**
  * 分配给催收员open
  */
  userOpen() {
    this.$nextTick(() => {
      let userAllocate: any = this.$refs['user-allocate'];
      userAllocate.refreshData()
    })
  }
  /**
   * 分配给机构
   */
  orgOpen() {
    this.$nextTick(() => {
      let orgAllocate: any = this.$refs['org-allocate'];
      orgAllocate.refreshData()
    })
  }
}
</script>
<style scoped>

</style>
<style>

</style>
