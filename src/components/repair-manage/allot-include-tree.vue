<template>
  <el-col>
    <el-col :span="6" style="min-height:400px">
      <department-tree @onCurrentChange="getCheckedNodes"></department-tree>
    </el-col>
    <el-col :span="18">
      <data-form ref="databox" :model="deptParmas"  @onSearch="refreshData">
        <!--输入区域 -START-->
        <template slot="default-input">
          <el-form-item label="姓名" prop='realName'>
            <el-input v-model="deptParmas.realName"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop='roleName'>
            <el-input v-model="deptParmas.roleName"></el-input>
          </el-form-item>
        </template>
      </data-form>
        <!--输入区域 -END-->
        <!--数据列区域 -START-->
    <data-box  ref="data-box" :page="pageService" :selectionList.sync="selectionList" :data="allotDataSet"  @onPageChange="refreshData">
        <template slot="columns">
          <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(3)" >
               <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(3)">
               <template slot-scope="scope">
            <span>{{scope.row.realName}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="roleNames" label="角色" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope="scope">
              <span>{{scope.row.roles.length!== 0?scope.row.roles[0].name: ''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="所属机构" :min-width="$helper.getColumnWidth(3)">
            <template slot-scope='scope'>
              <span>{{scope.row.department?scope.row.department.name:''}}</span>
            </template>
          </el-table-column>
        </template>
        <!--数据列区域 -END-->
      </data-box>
    </el-col>
    <el-col class="btns">
      <el-button @click="nextStep">下一步</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-col>
  </el-col>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { Emit } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import DepartmentTree from "~/components/system-manage/department-tree.vue";
import { DepartmentService } from "~/services/business-service/department.service";
import { UserService } from "~/services/business-service/user.service";

const caseManageModule = namespace("case-manage");
@Component({
  components: {
    DataBox,
    DataForm,
    DepartmentTree
  }
})
export default class AllotIncludeTree extends Vue {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @Dependencies(UserService) private userService: UserService;

  @caseManageModule.State("caseAllotUser") caseAllotUser;
  @caseManageModule.State("caseAllotOrg") caseAllotOrg;
  @caseManageModule.Mutation("updateCaseAllotUser") updateCaseAllotUser;
  @caseManageModule.Mutation("updateCaseAllotOrg") updateCaseAllotOrg;

  @Emit("close")
  close() {}
  @Emit("user")
  user() {}
  @Emit("org")
  org() {}
  private allotType: any = 1;
  private userDataSet: Array<any> = [];
  private allotDataSet: any = null;
  private selectionList: any = [];
  private nowNode: any = null;
  private deptParmas: any = {
    deptCode: "",
    userName: "",
    realName: "",
    roleId: "",
    roleName: ""
  };
  private depCode: any = "";
  private multipleSelection: any = [];
  get AllotUser() {
    return this.caseAllotUser;
  }
  set AllotUser(value) {
    this.updateCaseAllotUser(value);
  }

  get AllotOrg() {
    return this.caseAllotOrg;
  }
  set AllotOrg(value) {
    this.updateCaseAllotOrg(value);
  }
  /**
   * 下一步
   */
  nextStep() {
    if (this.allotDataSet) {
      if (this.selectionList.length > 0) {
        this.$confirm("是否将案件分配给所选催收员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(() => {
          let userIdList: any = this.selectionList.map(v => {
            return v.id;
          });
          this.user();
          this.updateCaseAllotUser(this.selectionList);
        });
      } else {
        if (this.depCode != "oooooooo_gltGgPwE") {
          this.$confirm("是否将案件分配给所选机构?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info"
          }).then(() => {
            this.org();
            this.updateCaseAllotOrg(this.allotDataSet);
          });
        } else {
          this.$alert("请选择催收机构", "提示", {
            confirmButtonText: "确定"
          });
          return false;
        }
      }
    } else {
      this.$alert("请选择催收机构或催收员", "提示", {
        confirmButtonText: "确定"
      });
      return false;
    }
  }
  /**
   * 取消
   */
  cancel() {
    this.close();
    let databox: any = this.$refs["data-box"];
    databox.clearSelection();
  }

  /**
   * 点击部门显示催收员列表
   */
  getCheckedNodes({ code }) {
    this.depCode = code; // oooooooo_gltGgPwE 为催收机构 主菜单
    if (this.deptParmas.deptCode !== code) {
      this.deptParmas.deptCode = code;
      this.pageService.reset();
      this.deptParmas.realName = "";
      this.deptParmas.roleName = "";
      this.refreshData();
    }
  }
  /**
   * 刷新
   */
  refreshData() {
    this.userService
      .queryUserByDeptAndRole(this.deptParmas, this.pageService)
      .subscribe(
        data => {
          this.allotDataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>
<style scoped>
.btns {
  padding: 20px;
  text-align: center;
}
</style>
