<template>
  <!--添加机构-->
  <section class="component add-organize">
    <el-form :rules="addOrganizeRules" :model="addOrgModel" ref="addOrg" label-width="130px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="addOrgModel.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="组织机构类型" prop="type">
        <el-select size="small" v-model="addOrgModel.type">
          <el-option v-for="{value,label} in $dict.getDictData('0001')" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织机构等级" prop="level">
        <el-select v-model="addOrgModel.level" size="small" disabled>
          <el-option v-for="{value,label} in $dict.getDictData('0002')" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态 " prop="status">
        <el-select v-model="addOrgModel.status" size="small">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="停用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="status">
        <el-select size="small" v-model="addOrgModel.companyCode" :disabled="disabled">
          <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="addOrgModel.remark" :autosize="{ minRows:2, maxRows:4}" :maxlength="500"></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row type="flex" justify="center">
          <el-button @click="close()">取消</el-button>
          <el-button @click="addOrganizeCommit" :loading="submitLoading">确定</el-button>
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
import { DepartmentService } from "~/services/business-service/department.service";
import { CompanyService } from "~/services/business-service/company.service";
@Component({
  components: {}
})
export default class AddOrganize extends Vue {
  @Dependencies(DepartmentService) private departmentService: DepartmentService;
  @Dependencies(CompanyService) private companyService: CompanyService;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  private addOrgModel: any = {
    name: "",
    type: "",
    remark: "",
    status: 0,
    companyCode: "",
    parentId: "",
    level: ""
  };
  private disabled: boolean = false;

  /**
   * 添加机构信息校验规则
   */
  private addOrganizeRules: any = {
    name: { required: true, message: "请输入机构名称", trigger: "blur" },
    type: {required: true, message:"请选择组织机构", trigger: "change"},
    companyCode: { required: true, message: "请选择公司名称", trigger: "change" }
  };
  private submitLoading: Boolean = false;
  refresh(adddata) {
    if (!adddata) {
      return
    }

    if (adddata.level > 8) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }

    this.addOrgModel.parentId = adddata.id;
    this.addOrgModel.companyCode = adddata.companyCode;
    this.addOrgModel.level = adddata.level + 1;
  }

  /**
   * 添加机构确认
   */
  addOrganizeCommit() {
    let form: any = this.$refs["addOrg"];
    form.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      this.departmentService.createDepartment(this.addOrgModel)
        .subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("添加机构成功");
          this.$emit("refresh");
          this.close()
        },
        err => {
          this.submitLoading = false;
          this.$message.error(err.msg)
        })
      
    });
  }

  /**
   * 关闭窗口
  */
  close() {
    let form: any = this.$refs["addOrg"];
    form.resetFields();
    this.$emit("close");
  }


  mounted() {
    // 非超级管理员禁选公司code和公司名称，默认缺省值
    if (!this.isSupperAdmin) {
      this.disabled = true;
    }
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
