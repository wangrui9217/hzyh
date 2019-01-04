<template>
  <section class="component modify-client">
    <el-form :model="modifyModel" :rules="rules" ref="modify-form" label-width="90px">
     <el-row>
        <el-col :span="12">
          <el-form-item label="委托方编码" prop="code">
            <el-input v-model="modifyModel.code" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托方" prop="name">
            <el-input v-model="modifyModel.name"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="机构类型" prop="type">
          <el-radio-group v-model="modifyModel.type" disabled>
            <el-radio v-for="{value,label} in $dict.getDictData('0036')" :label="value" :key="value">{{label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-col>
          <el-form-item label="省份/城市" prop="cityList">
            <el-cascader v-model="modifyModel.cityList" :options="$city.getCityData()" change-on-select  clearable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="详细地址" prop="address">
            <el-input type="textarea" v-model="modifyModel.address" :rows="1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="modifyModel.contacts"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="modifyModel.phone" :maxlength="12"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="modifyModel.mobile" :maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="modifyModel.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="modifyModel.remark" :maxlength="500"></el-input>
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
  import { State, Action } from "vuex-class";
  import { PrincipalService } from "~/services/business-service/principal.service";
  import { Emit } from "vue-property-decorator";
  import clone from "clone";

  @Component({
    components: {}
  })
  export default class ModifyClient extends Vue {
    @Dependencies(PrincipalService) private principalService: PrincipalService;
    @State companyList: any;
    @Emit('refreshList')
    refreshList(){}    
    @Emit('close')
    close(){}
    @Action getPrincipalList
    private modifyModel: any = {};
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
    reset(){
      let modifyForm: any = this.$refs['modify-form']
      modifyForm.resetFields()
    }
    refresh(obj){
      this.modifyModel = clone(obj)
      let arr = this.$city.getCityParent(Number(this.modifyModel.areaId))
      this.modifyModel.cityList = arr?arr.concat([Number(this.modifyModel.areaId)]):[]
    }
    commit(){
      let modifyForm: any = this.$refs['modify-form']
      modifyForm.validate((valid) => {
        if (!valid) return false;
        this.submitLoading = true;
        let [prinPrid, prinCityid, prinCtyid] = this.modifyModel.cityList
        this.modifyModel.areaId = prinCtyid || prinCityid || prinPrid
        this.modifyModel.prinCityid = prinCityid
        this.modifyModel.prinCtyid = prinCtyid
        this.principalService.createPrincipal(this.modifyModel).subscribe(data => {
          this.submitLoading = false;
          this.$message.success('修改成功!')
          this.refreshList()
          this.getPrincipalList()
          this.close()
        }, ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        })
      })
    }
  }
</script>

<style lang="less" scoped>

</style>
