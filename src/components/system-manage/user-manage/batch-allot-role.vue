<template>
  <section class="component batch-allot-role">
    <data-form :model="model" @onSearch="refreshData" ref="data-form" >
      <template slot="default-input">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
      </template>
    </data-form>
    <data-box :data="dataSet" @onPageChange="refreshData"  :selectionList.sync="selectionRow" ref="data-box" :height="450">
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
export default class BatchAllotRole extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @Dependencies(RoleService) private roleService: RoleService;
  @Prop() userList: any;
  @Prop() companyCode: any;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}
  private model: any = {
    name: "",
    companyCode: this.companyCode
  };
  private selectionRow: any = [];
  private dataSet = null;
  private submitLoading: Boolean = false;
  refresh() {
    this.model.name = "";
    this.refreshData();
    this.selectionRow = [];
  }
  confirm() {
    this.submitLoading = true;
    let roleIds = this.selectionRow.map(row => row.id);
    let userIds = this.userList.map(v => v.id);
    this.userService.manyUserAddRole({ roleIds, userIds }).subscribe(
      data => {
        this.submitLoading = false;
        this.$message.success("分配成功");
        this.close();
        this.refreshList();
      },
      err => {
        this.submitLoading = false;
        this.$message.error(err.msg);
      }
    );
  }
  refreshData() {
    this.roleService
      .queryAllRole()
      .subscribe(
        data => {
          this.dataSet = data;
        },
        ({ msg }) => {
          this.$message.error(msg);
        }
      );
  }
}
</script>

<style lang="less" scoped>
</style>
