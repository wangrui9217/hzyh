<template>
  <section class="component modify-role">
    <el-form :model="modifyModel" :rules="rules" ref="modify-form" label-width="90px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="modifyModel.name" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
        <el-col :span="18">
          <el-select size="small" v-model="modifyModel.companyCode" disabled>
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="状态" align="left" prop="status">
        <el-select v-model="modifyModel.status">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="停用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-col :span="18">
          <el-input type="textarea" v-model="modifyModel.remark" :rows="3" :maxlength="500"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row type="flex" justify="center">
          <el-button @click="close">取消</el-button>
          <el-button @click="commit" :loading="submitLoading">确定</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { RoleService } from "~/services/business-service/role.service";
import { Emit } from "vue-property-decorator";
import clone from "clone";

@Component({
  components: {}
})
export default class ModifyRole extends Vue {
  @Dependencies(RoleService) private roleService: RoleService;
  @State companyList: any;
  @Emit("refreshList")
  refreshList() { }
  @Emit("close")
  close() { }

  @Getter isSupperAdmin: boolean;
  private modifyModel: any = {
    companyCode: "",
    name: "",
    status: 0,
    remark: ""
  };
  private rules: any = {
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
  };
  private submitLoading: Boolean = false;
  reset() {
    let modifyForm: any = this.$refs["modify-form"];
    modifyForm.resetFields();
  }
  refresh(obj) {
    this.modifyModel = clone(obj);
  }
  commit() {
    let modifyForm: any = this.$refs["modify-form"];
    modifyForm.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      this.modifyModel.resources = null;
      this.roleService.updateRole(this.modifyModel).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("修改成功!");
          this.refreshList();
          this.close();
        },  ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    });
  }
}
</script>

<style lang="less" scoped>

</style>
