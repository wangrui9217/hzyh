<template>
  <!--机构与用户管理-->
  <section class="page user-manage">
    <el-row type="flex">
      <el-col style="flex-basis:250px;border:1px solid #e4e4e4;min-height:595px;overflow:atuo">
        <el-col class="text-right tree-header">
          <el-button @click="onAdd" v-auth="5535">添加机构</el-button>
        </el-col>
        <origanize-tree @drag="onDrag" @edit="onEdit" @add="onAdd" @remove="onRemove" @change="onChange" isIcon="true" ref="orgTree" :dataList="orgInfo"></origanize-tree>
      </el-col>
      <el-col style="margin-left:20px;width:500px;flex-grow:1">
        <data-form :model="userModel" @onSearch="refreshData" :page="pageService">
          <template slot="default-input">
            <el-form-item label="用户名" prop="userName" v-auth="5524">
              <el-input v-model="userModel.userName"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName" v-auth="5525">
              <el-input v-model="userModel.realName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state" v-auth="5526">
              <el-select v-model="userModel.state" placeholder="请选择" clearable>
                <el-option label="启用" :value="504"></el-option>
                <el-option label="停用" :value="505"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template slot="default-button">
            <el-button @click="dialog.addUser = true" v-show="status === 0" v-auth="5527">新增用户</el-button>
            <el-button @click="batchRoleClick" v-auth="5528">批量分配角色</el-button>
            <el-button @click="batchFacilityClick" v-auth="5529">批量管理设备</el-button>
            <el-button @click="exportUserList" v-auth="5530">导出用户列表</el-button>
          </template>
        </data-form>
        <data-box :data="userDataSet" :selectionList.sync="selectionList" @onPageChange="refreshData" :page="pageService" ref="data-box">
          <template slot="columns">
            <el-table-column prop="userName" label="用户名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="realName" label="姓名" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="department.name" label="所属机构" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" label="状态" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 504">启用</span>
                <span v-if="scope.row.status == 505">停用</span>
              </template>
            </el-table-column>
            <el-table-column prop="collectionGrade" label="催收员等级" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span>{{ scope.row.collectionGrade | dictConvert}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="divisionSwitch" label="分案开关" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span>{{ scope.row.divisionSwitch | dictConvert}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="催收类型" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span>{{ scope.row.type | dictConvert}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" min-width="90">
            </el-table-column>
            <el-table-column prop="callPhone" label="主叫号码" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" :min-width="$helper.getColumnWidth(6)">-->
            </el-table-column>
            <el-table-column prop="operateTime" label="创建时间" :min-width="$helper.getColumnWidth(6)">-->
              <template slot-scope="scope">
                <span>{{scope.row.operateTime | dateTimeFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="manager" label="是否管理员" :min-width="$helper.getColumnWidth(4)">
              <template slot-scope="scope">
                <span v-if="scope.row.manager == 1">是</span>
                <span v-if="scope.row.manager == 0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="loginDevice" label="登录设备" :min-width="$helper.getColumnWidth(3)">
              <template slot-scope="scope">
                <span v-if="scope.row.loginDevice == 1">PC</span>
                <span v-if="scope.row.loginDevice == 2">手机</span>
              </template>
            </el-table-column>
          
            <el-table-column prop="messagePushId" label="绑定消息推送标识" :min-width="$helper.getColumnWidth(5)">
            </el-table-column>
            <el-table-column label="操作" :min-width="$helper.getColumnWidth(10)">
              <template slot-scope="scope">
                <el-button type="text" @click="dialog.modify=true,userObj=scope.row" v-auth="5531">修改</el-button>
                <el-button type="text" @click="dialog.roleAllot=true,userObj=scope.row" v-auth="5532">分配角色</el-button>
                <el-button type="text" size="small" @click="resetClick(scope)" v-auth="5533">重置密码</el-button>
                <el-button type="text" size="small" @click="dialog.facility=true,userObj=scope.row" v-auth="5534">设备管理</el-button>
              </template>
            </el-table-column>
          </template>
        </data-box>
        <!--批量分配角色-->
        <el-dialog title="批量分配角色" :center="true" :visible.sync="dialog.batchRole" width="600px" @open="$nextTick(()=>$refs['batch-allot-role'].refresh())">
          <batch-allot-role :companyCode="companyCode" :userList="selectionList" ref="batch-allot-role" @refreshList="refreshData" @close="dialog.batchRole = false"></batch-allot-role>
        </el-dialog>
        <!--弹出框-END-->
        <el-dialog title="批量设备管理" :center="true" :visible.sync="dialog.batchFacility" width="60%" @open="$nextTick(()=>$refs['batch-facility'].refresh(selectionList))">
          <batch-facility ref="batch-facility" @refreshList="refreshData"></batch-facility>
        </el-dialog>
        <!--分配角色-->
        <el-dialog title="分配角色" :center="true" :visible.sync="dialog.roleAllot" width="600px" @open="$nextTick(()=>$refs['allot-role'].refreshData())">
          <allot-role ref="allot-role" :companyCode="companyCode" :user="userObj" @refreshList="refreshData" @close="dialog.roleAllot = false"></allot-role>
        </el-dialog>
        <!--设备管理-->
        <el-dialog title="设备管理" :center="true" :visible.sync="dialog.facility" width="60%" @open="$nextTick(()=>$refs['facility-manage'].refresh(userObj))">
          <facility-manage ref="facility-manage"></facility-manage>
        </el-dialog>
        <!--设备管理-->
        <!--修改用户-->
        <el-dialog title="修改用户" :center="true" :visible.sync="dialog.modify" width="50%" @open="$nextTick(()=>$refs['modify-user'].refresh(userObj))">
          <modify-user ref="modify-user" @refreshList="refreshData" @close="dialog.modify = false" @refresh="refreshData"></modify-user>
        </el-dialog>
        <!--新增用户-->
        <el-dialog title="新增用户" @open="getdeptId" @close="dialog.addUser = false" :visible.sync="dialog.addUser" :close-on-click-modal="false" :show-close="false">
          <add-user @close="dialog.addUser=false" @refresh="refreshData" ref="dept" :deptId="deptId"></add-user>
        </el-dialog>
        <!--添加机构-->
        <el-dialog title="添加机构" @open="dialogOpen" @close="dialog.addOrganizeFlag = false" :visible.sync="dialog.addOrganizeFlag" width="450px" :close-on-click-modal="false" :show-close="false">
          <add-organize @close="dialog.addOrganizeFlag=false" @refresh="updateOrgNameInfo()" :deptId="deptId" ref="add-dept"></add-organize>
        </el-dialog>
        <!--修改机构-->
        <el-dialog title="修改机构" @open="getOragnize" @close="dialog.editOrganizeFlag = false" :visible.sync="dialog.editOrganizeFlag" width="450px" :close-on-click-modal="false" :show-close="false">
          <modify-organize @refresh="updateOrgNameInfo()" ref="edit" :editData="editdata" @close="dialog.editOrganizeFlag=false"></modify-organize>
        </el-dialog>
      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { Action, State, Mutation, Getter, namespace } from "vuex-class";
import { DepartmentService } from "~/services/business-service/department.service";
import { DepartmentInfoService } from "~/services/datasync-service/department-info.service";
import { UserService } from "~/services/business-service/user.service";
import { LoginService } from "~/services/business-service/login.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import BatchAllotRole from "~/components/system-manage/user-manage/batch-allot-role.vue";
import AllotRole from "~/components/system-manage/user-manage/allot-role.vue";
import FacilityManage from "~/components/system-manage/user-manage/facility-manage.vue";
import BatchFacility from "~/components/system-manage/user-manage/batch-facility.vue";
import DepartmentTree from "~/components/system-manage/department-tree.vue";
import ModifyUser from "~/components/system-manage/user-manage/modify-user.vue";
import AddUser from "~/components/system-manage/user-manage/add-user.vue"; // 新增用户
import OriganizeTree from "~/components/system-manage/user-manage/origanize-tree.vue";
import AddOrganize from "~/components/system-manage/user-manage/add-organize.vue";
import ModifyOrganize from "~/components/system-manage/user-manage/modify-organize.vue";

import { CommonService } from "~/utils/common.service";
const systemManageModule = namespace("system-manage");

@Auth(852)
@Layout("workspace")
@Component({
  components: {
    ModifyUser,
    DepartmentTree,
    BatchFacility,
    FacilityManage,
    AllotRole,
    BatchAllotRole,
    DataForm,
    DataBox,
    AddUser,
    OriganizeTree,
    AddOrganize,
    ModifyOrganize
  }
})
export default class UserManage extends Vue {
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @Dependencies(DepartmentInfoService)
  private departmentInfoService: DepartmentInfoService;
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(LoginService) private loginService: LoginService;
  @Dependencies(PageService) private pageService: PageService;
  @Action getDepartmentList;
  @Action getCompanyList;
  @systemManageModule.State orgInfo;
  @systemManageModule.Action updateOrgNameInfo;

  private userDataSet = null;
  private userModel: any = {
    userName: "",
    realName: "",
    state: 504,
    deptCode: "",
    isManager: "manager"
  };
  private userObj: any = {};
  private companyCode: any = "";
  private dialog: any = {
    modify: false,
    batchRole: false,
    roleAllot: false,
    facility: false,
    batchFacility: false,
    batchFacilityAll: false,
    addUser: false,
    editOrganizeFlag: false,
    addOrganizeFlag: false
  };
  private editdata: any = {};
  private selectionList: Array<any> = [];
  private userList: any = [];
  private status: any = 0;
  private deptId: string = "";
  private dept: any = "";
  private defaultParams: any = {
    deptCode: ""
  };
  private pid: any = "";
  private deptCode: any = "";

  onDrag(...args) {
    this.departmentService
      .moveDepartment({
        deptId: args[0].id,
        parentDeptId: args[2].id
      })
      .subscribe(
        data => {
          this.$message.success("移动成功!");
          this.updateOrgNameInfo();
        },
        ({ msg }) => {
          this.updateOrgNameInfo();
          this.$message.error(msg);
        }
      );
  }
  onChange(value) {
    this.userModel.deptCode = value.code;
    this.deptId = value.id;
    this.dept = value;
    this.refreshData();
  }
  onEdit(value) {
    this.dialog.editOrganizeFlag = true;
    this.editdata = value;
  }
  onAdd(value) {
    if (value && value.level === 14) {
      this.dialog.addOrganizeFlag = false;
      this.$message("不允许添加六级以上机构");
      return;
    }
    this.getCompanyList();
    this.dialog.addOrganizeFlag = true;
  }
  onRemove(value) {
    this.$confirm("此操作将永久删除该组织机构, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.departmentService.deleteDepartment(value.id).subscribe(
          data => {
            this.updateOrgNameInfo();
            this.$message.success("删除成功!");
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(() => {
        this.$message.error("已取消删除");
      });
  }
  refresh(formName) {
    this.$nextTick(() => {
      let form: any = this.$refs[formName];
      form.refresh();
    });
  }
  /**
   * 修改机构open事件(获取机构)
   */
  getOragnize() {
    this.$nextTick(() => {
      let edit: any = this.$refs["edit"];
      edit.refresh();
    });
    document.documentElement.style.overflow = "hidden";
  }
  /**
   * 新增用户open事件
   */
  getdeptId() {
    this.$nextTick(() => {
      let dept: any = this.$refs["dept"];
      dept.refresh(this.dept);
    });
    document.documentElement.style.overflow = "hidden";
  }
  dialogOpen() {
    this.$nextTick(() => {
      let addUser: any = this.$refs["add-dept"];
      addUser.refresh(this.dept);
    });
  }
  /**
   * 手动刷新缓存
   */
  flushCacheClick() {
    this.$confirm("您确定要手动刷新缓存吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.userService.flushCache().subscribe(
          data => {
            this.$message.success("刷新成功");
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(ex => {
        this.$message.info("已取消");
      });
  }
  /**
   * 手工同步机构
   */
  batchOrgClick() {
    this.$confirm("您确定要执行手工同步机构吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.departmentInfoService.handleDepartment().subscribe(
          data => {
            this.$message.success("操作成功，正在更新数据");
            this.pageService.reset();
            this.getDepartmentList();
          },
          ({ msg }) => {
            this.$message.error(msg);
          }
        );
      })
      .catch(ex => {
        this.$message.info("已取消");
      });
  }
  /**
   * 批量管理设备
   */
  batchFacilityClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要操作的用户", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.dialog.batchFacility = true;
    }
  }
  /**
   * 导出用户列表
   */
  exportUserList() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要操作的用户", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.userList = this.selectionList;
      this.userService.exportUserList({ userList: this.userList }).subscribe(
        val => {
          this.$message.info("开始导出");
          CommonService.downloadFile(val, "用户列表");
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
    }
  }
  /**
   * 重置密码
   */
  resetClick(scope) {
    this.$confirm(`您确定要对用户${scope.row.userName}重置密码吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loginService
          .resetPassword({
            oldPassword: scope.row.password,
            userId: scope.row.id
          })
          .subscribe(
            data => {
              this.$message.success("重置密码成功");
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消重置"
        });
      });
  }
  /**
   * 批量分配角色
   */
  batchRoleClick() {
    if (this.selectionList.length === 0) {
      this.$alert("请选择要分配角色的用户", "提示", {
        confirmButtonText: "确定"
      });
    } else {
      this.dialog.batchRole = true;
    }
  }
  /**
   * 分配角色
   */
  allotRoleClick() {}
  refreshData() {
    this.userService.query(this.userModel, this.pageService).subscribe(
      data => {
        this.userDataSet = data;
        this.companyCode = data[0] ? data[0].companyCode : "";
      },
      ({ msg }) => {
        this.$message.error(msg);
      }
    );
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false;
    }
  }
  mounted() {
    this.updateOrgNameInfo();
  }
}
</script>

<style lang="less">
.tree-header {
  padding: 10px 20px;
  border-bottom: 1px solid #e4e4e4;
}
</style>
