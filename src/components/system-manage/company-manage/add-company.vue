<template>
  <section class="component add-company">
    <el-form :rules="companyRules" :model="companyModel" ref="form" label-width="90px" class="addCompany">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="chinaName" v-show="isSupperAdmin">
            <el-input type="input" v-model="companyModel.chinaName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司英文名" prop="engName">
            <el-input type="input" v-model="companyModel.engName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司编码" prop="code">
            <el-input type="input" v-model="companyModel.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人代表">
            <el-input type="input" v-model="companyModel.legPerson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司地址" prop="address">
            <el-input type="input" v-model="companyModel.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属城市" prop="city">
            <el-input type="input" v-model="companyModel.city"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactPerson">
            <el-input type="input" v-model="companyModel.contactPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input type="input" v-model="companyModel.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="companyModel.status">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="停用" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司传真" prop="fax">
            <el-input type="input" v-model="companyModel.fax"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0px" align="center">
        <el-button @click="commit" :loading="submitLoading">确定</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { CompanyService } from "~/services/business-service/company.service";
import { Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  components: {}
})
export default class AddCompany extends Vue {
  @Dependencies(CompanyService) private companyService: CompanyService;
  @Emit("refreshList")
  refreshList() {}
  @Emit("close")
  close() {}

  @Getter isSupperAdmin: boolean;

  // 公司数据实体
  private companyModel: any = {
    address: "",
    chinaName: "",
    city: "",
    code: "",
    contactPerson: "",
    engName: "",
    fax: "",
    field: "",
    legPerson: "",
    operateTime: "",
    operator: "",
    phone: "",
    status: 0
  };
  private companyRules: any = {
    chinaName: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
    engName: [
      { required: true, message: "请输入公司英文名", trigger: "blur" },
      {
        message: "请输入英文字母",
        trigger: "blur",
        pattern: /^(([a-zA-Z\s])+)$/
      }
    ],
    code: [{ required: true, message: "请输入公司编码", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }]
  };
  private submitLoading: Boolean = false;
  commit() {
    let form: any = this.$refs.form;
    form.validate(valid => {
      if (!valid) {
        return;
      }
      this.submitLoading = true;
      this.companyService.createCompany(this.companyModel).subscribe(
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
  refresh() {
    let form: any = this.$refs.form;
    form.resetFields();
  }
}
</script>

<style lang="less" scoped>

</style>
