<template>
  <section class="component add-role">
    <el-form :model="addModel" :rules="rules" ref="add-form" label-width="90px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="addModel.name" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
        <el-col :span="18">
          <el-select size="small" v-model="addModel.companyCode" :disabled="!isSupperAdmin">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="状态" align="left" prop="status">
        <el-select v-model="addModel.status">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="停用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-col :span="18">
          <el-input type="textarea" v-model="addModel.remark" :rows="3" :maxlength="500"></el-input>
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

@Component({
  components: {}
})
export default class AddRole extends Vue {
  @Dependencies(RoleService) private roleService: RoleService;
  @State companyList: any;
  @State userData: any;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}

  @Getter isSupperAdmin: boolean;

  private addModel: any = {
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
    let addForm: any = this.$refs["add-form"];
    addForm.resetFields();
  }
  refresh(companyCode) {
    if (companyCode) {
      this.addModel.companyCode = companyCode;
    } else {
      this.addModel.companyCode = this.userData.companyCode;
    }
  }
  commit() {
    let addForm: any = this.$refs["add-form"];
    addForm.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      this.roleService.createRole(this.addModel).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("新增成功!");
          this.refreshList();
          this.close();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    });
  }
  mounted() {}
}
</script>

<style lang="less" scoped>
</style>
