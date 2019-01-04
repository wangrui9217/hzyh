<template>
  <section class="component add-client">
    <el-form :rules="rules" :model="addModel" ref="add-form" label-width="100px" class="text-left">
      <el-row>
        <el-form-item label="委托方" prop="name">
          <el-input v-model="addModel.name"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" v-show="isSupperAdmin">
          <el-select size="small" v-model="addModel.companyCode">
            <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.chinaName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类型" prop="type">
          <el-radio-group v-model="addModel.type">
            <el-radio v-for="{value,label} in $dict.getDictData('0036')" :label="value" :key="value">{{label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-col>
          <el-form-item label="省份/城市" prop="cityList">
            <el-cascader v-model="addModel.cityList" :options="$city.getCityData()" change-on-select clearable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="详细地址" prop="address">
            <el-input type="textarea" v-model="addModel.address" :rows="1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="addModel.contacts"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addModel.phone" :maxlength="12"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addModel.mobile" :maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addModel.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addModel.remark" :maxlength="500"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center" style="margin-top:30px">
      <el-button @click="close">取消</el-button>
      <el-button @click="commit" :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Getter, Action } from "vuex-class";
import { Emit } from "vue-property-decorator";
import { PrincipalService } from "~/services/business-service/principal.service";

@Component({
  components: {}
})
export default class AddClient extends Vue {
  @Dependencies(PrincipalService) private principalService: PrincipalService;
  @State companyList: any;
  @State userData: any;
  @Getter isSupperAdmin: boolean;
  @Emit('refreshList')
  refreshList() { }
  @Emit('close')
  close() { }
  @Action getPrincipalList
  private addModel: any = {
    name: '',
    type: '',
    prinProvinces: '',
    address: '',
    contacts: '',
    mobile: '',
    phone: '',
    email: '',
    remark: '',
    cityList: [],
    companyCode: ''
  };
  private submitLoading: Boolean = false;
  private rules: any = {
    contacts: [
      { message: '请输入汉字或英文字母', trigger: 'blur', pattern: /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/ }
    ],
    name: [
      { required: true, message: '请输入委托方', trigger: 'blur' }
    ],
    mobile: [
      { message: '请输入正确的手机号', trigger: 'blur', pattern: /^1(3|4|5|7|8)\d{9}$/ }
    ],
    phone: [
      { message: '请输入正确的电话号码', trigger: 'blur', pattern: /^[-0-9()（）]{7,18}$/ }
    ],
    email: [
      { message: '请输入正确的邮箱', trigger: 'blur', type: 'email' },
      { min: 1, max: 50, message: '邮箱长度不能超过50位', trigger: 'blur' }
    ],
    type: [
      { required: true, type: 'number', message: '请选择机构类型', trigger: 'change' }
    ]
  }
  reset() {
    let addForm: any = this.$refs['add-form']
    addForm.resetFields()
  }
  refresh(companyCode) {
    if (companyCode) {
      this.addModel.companyCode = companyCode
    } else {
      this.addModel.companyCode = this.userData.companyCode
    }
  }
  commit() {
    let addForm: any = this.$refs['add-form']
    addForm.validate((valid) => {
      if (!valid) return false;
      this.submitLoading = true;
      let [prinPrid, prinCityid, prinCtyid] = this.addModel.cityList
      this.addModel.areaId = prinCtyid || prinCityid || prinPrid
      this.addModel.prinCityid = prinCityid
      this.addModel.prinCtyid = prinCtyid
      this.principalService.createPrincipal(this.addModel).subscribe(data => {
        this.submitLoading = false;
        this.$message.success('新增成功!')
        this.refreshList()
        this.getPrincipalList()
        this.close()
      }, ({ msg }) => {
        this.submitLoading = false;
        this.$message.error(msg);
      })
    })
  }
  mounted() { }
}
</script>

<style lang="less" scoped>

</style>
