<template>
  <!--角色管理-->
  <section class="page role-manage">
    <data-form :model="roleModel" @onSearch="refreshData" :page="pageService">
      <template slot="default-input">
        <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
          <el-select size="small" v-model="companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name" v-auth="5545">
          <el-input v-model="roleModel.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-auth="5546">
          <el-select v-model="roleModel.status" placeholder="请选择" clearable>
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="default-button">
        <el-button @click="dialog.add = true" v-auth="5547">新增角色</el-button>
      </template>
    </data-form>
    <data-box :data="roleDataSet" @onPageChange="refreshData" :page="pageService">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="name" label="角色名称" :min-width="$helper.getColumnWidth(3)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remark" label="角色描述" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态" :min-width="$helper.getColumnWidth(2)">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">启用</span>
            <span v-if="scope.row.status === 1">停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="更新时间" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span>{{scope.row.operateTime|dateTimeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" :min-width="$helper.getColumnWidth(2)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button type="text" @click="dialog.modify = true, roleObj = scope.row" v-auth="5548">修改</el-button>
            <el-button type="text" @click="dialog.module = true, roleObj = scope.row" v-auth="5549">模块权限</el-button>
            <el-button type="text" @click="dialog.list = true, roleObj = scope.row" v-auth="5550">用户列表</el-button>
            <el-button type="text" @click="deleteClick(scope)" v-auth="5551">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
    <!--用户列表弹框-->
    <el-dialog title="用户列表" :center="true" :visible.sync="dialog.list" width="60%" @open="$nextTick(()=>$refs['user-list'].refresh(roleObj.id))">
      <user-list ref="user-list"></user-list>
    </el-dialog>
    <!--新增角色弹出框-->
    <el-dialog title="新增角色" :center="true" :visible.sync="dialog.add" width="30%" @close="$refs['add-role'].reset()" @open="$nextTick(()=>$refs['add-role'].refresh(roleModel.companyCode))">
      <add-role @close="dialog.add = false" @refreshList="refreshData" ref="add-role"></add-role>
    </el-dialog>

    <!--修改角色弹出框-->
    <el-dialog title="修改角色" :center="true" :visible.sync="dialog.modify" width="30%" @open="$nextTick(()=>$refs['modify-role'].refresh(roleObj))">
      <modify-role ref="modify-role" @close="dialog.modify = false" @refreshList="refreshData"></modify-role>
    </el-dialog>

    <!--角色模块权限弹出框-->
    <el-dialog title="角色模块权限" :center="true" :visible.sync="dialog.module" width="60%">
      <module-permission ref="module-permission" :roleId="roleObj.id" @close="dialog.module = false" @refreshList="refreshData"></module-permission>
    </el-dialog>

  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { RoleService } from "~/services/business-service/role.service";
import { PageService } from "~/utils/page.service";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import AddRole from "~/components/system-manage/role-manage/add-role.vue";
import ModifyRole from "~/components/system-manage/role-manage/modify-role.vue";
import UserList from "~/components/system-manage/role-manage/user-list.vue";
import ModulePermission from "~/components/system-manage/role-manage/module-permission.vue";
import { State, Getter } from "vuex-class";

@Auth(854)
@Layout('workspace')
@Component({
  components: {
    ModulePermission,
    AddRole,
    ModifyRole,
    UserList,
    DataForm,
    DataBox
  }
})
export default class RoleManage extends Vue {
  @Dependencies(RoleService) private roleService: RoleService;
  @Dependencies(PageService) private pageService: PageService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;

  private roleModel: any = {
    name: '',
    status: '',
    companyCode: '',
    operator: ''
  };
  private roleDataSet = null;
  private roleObj: any = {};
  private dialog: any = {
    add: false,
    modify: false,
    module: false,
    list: false
  };
  /**
* 考虑到非管理员不显示公司选择控件
* get 操作的时候强制设置非管理员所在公司码
*/
  get companyCode() {
    if (!this.isSupperAdmin) {
      this.roleModel.companyCode = this.userData.companyCode
    }
    return this.roleModel.companyCode
  }

  set companyCode(value) {
    this.roleModel.companyCode = value
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
   * 删除
   */
  deleteClick(scope) {
    this.$confirm('您确认要删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.roleService.deleteRole({ id: scope.row.id }).subscribe(data => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.pageService.reset()
        this.refreshData()
      }, ({ msg }) => {
        this.$message.error(msg);
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除!'
      })
    })
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    this.roleService.getAllRolePage(this.roleModel,this.pageService).subscribe(data => {
      this.roleDataSet = data
    }, ({ msg }) => {
      this.$message.error(msg);
    })
  }
  deactivated() {
    for (let v in this.dialog) {
      this.dialog[v] = false
    }
  }
}
</script>

<style lang="less">

</style>
