<template>
  <section class="component modify-organize">
    <!--修改机构-->
    <el-form :rules="editOrganizeRules" :model="editOrgModel" ref="editOrg" label-width="130px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="editOrgModel.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="组织机构类型" prop="type">
        <el-select size="small" v-model="editOrgModel.type">
          <el-option v-for="{value,label} in $dict.getDictData('0001')" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织机构等级" prop="level">
        <el-select v-model="editOrgModel.level" size="small" disabled>
          <el-option v-for="{value,label} in $dict.getDictData('0002')" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态 " prop="status">
        <el-select v-model="editOrgModel.status" size="small">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="停用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="status">
        <el-select size="small" v-model="editOrgModel.companyCode" :disabled="disabled">
          <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="editOrgModel.remark" :autosize="{ minRows:2, maxRows:4}" :maxlength="500"></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row type="flex" justify="center">
          <el-button @click="close()">取消</el-button>
          <el-button @click="editOrganizeCommit()" :loading="submitLoading">确定</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Mutation, Getter, namespace } from "vuex-class";
import { DepartmentService } from "~/services/business-service/department.service";
import { Emit, Prop } from "vue-property-decorator";
@Component({
  components: {}
})
export default class AddOrganize extends Vue {
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @State companyList;

  @Prop() editData: any;

  // 修改机构参数
  private editOrgModel: any = {
    name: "",
    type: "",
    remark: "",
    status: 0,
    companyCode: "",
    parentId: "",
    id: "",
    level: ""
  };
  /**
   * 添加机构信息校验规则
   */
  private editOrganizeRules: any = {
    name: [{ required: true, message: "请输入机构名称", trigger: "blur" }]
  };

  private disabled: boolean = false;
  private submitLoading: Boolean = false;
  /**
   * 获取要修改的当前行数据
   */
  refresh() {
    Object.keys(this.editOrgModel).forEach(x => {
      if (this.editData[x] !== undefined) {
        this.editOrgModel[x] = this.editData[x];
      }
    });
    this.disabled = this.editData.level > 8;
  }
  /**
   * 修改机构确认
   */
  editOrganizeCommit() {
    let form: any = this.$refs["editOrg"];
    form.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      this.departmentService.updateDepartment(this.editOrgModel).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("修改机构成功!");
          // 刷新机构数
          this.$emit("refresh");
          //   关闭dialog
          this.close();
        },
        err => {
          this.submitLoading = false;
          this.$message.error(err.msg);
        }
      );
    });
  }

  /**
   * 关闭窗口
   */
  close() {
    let form: any = this.$refs["editOrg"];
    form.resetFields();
    this.$emit("close");
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.data-grid {
  margin-bottom: 10px;
}

.header {
  border: solid 1px #dee1e5;
  border-bottom: 0px;
  height: 40px;
  line-height: 40px;
}
</style>
