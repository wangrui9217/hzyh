<template>
  <section class="component allot-role">
    <data-form :model="model" @onSearch="refreshData" ref="data-form">
      <template slot="default-input">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="dataSet" @onPageChange="refreshData" :selectionList.sync="selectionRow" ref="data-box" :height="450">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="name" label="角色名称" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" :min-width="$helper.getColumnWidth(4)" show-overflow-tooltip>
        </el-table-column>
      </template>
    </data-box>
    <el-row type="flex" justify="center" style="margin-top:20px">
      <el-button @click="close">取消</el-button>
      <el-button @click="confirm" :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataForm from "~/components/common/data-form.vue";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { UserService } from "~/services/business-service/user.service";
import { RoleService } from "~/services/business-service/role.service";
import { Emit, Prop } from "vue-property-decorator";
@Component({
  components: {
    DataForm,
    DataBox
  }
})
export default class AllotRole extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(RoleService) private roleService: RoleService;
  @Emit('refreshList')
  refreshList() { }
  @Emit('close')
  close() {
    let databox: any = this.$refs['data-box']
    databox.clearSelection()
  }
  @Prop()
  user: any;
  @Prop() 
  companyCode: any;
  private model: any = {
    name: '',
    companyCode:this.companyCode
  };

  private selectionRow: any = [];
  // 设置角色对象
  private roleSetModel: any = {
    roleIds: [],
    userId: ""
  }
  private dataSet:any = null;
  private submitLoading: Boolean = false;
  confirm() {
    if (!this.selectionRow) {
      this.$message.info('请选择角色')
      return
    }
    this.submitLoading = true;
    this.roleSetModel.userId = this.user.id
    this.roleSetModel.roleIds = this.selectionRow.map(x => x.id)
    this.userService.userAddRole(this.roleSetModel).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.success('分配成功')
        this.close()
        this.refreshList()
      },
      err => {
        this.submitLoading = false;
        this.$message.error(err.msg)
      }
    )
  }

  // 刷新数据
  refreshData() {
    this.roleService.queryAllRole()
      .subscribe(
      data => {
        this.dataSet = data
        let roleIds = this.user.roles.map(x => x.id)
        this.selectionRow = data.filter(row => roleIds.indexOf(row.id) > -1)
      },
      err => this.$message.error(err.msg)
      )
  }
}

</script>

<style lang="less" scoped>

</style>
