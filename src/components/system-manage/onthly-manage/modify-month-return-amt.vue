<template>
  <section class="page modify-month-return-amt">
    <el-form :rules="rulesUpdate" :model="formModel" ref="modify-form" label-width="100px" class="text-left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formModel.userName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="formModel.realName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年份" prop="year">
            <el-input v-model.number="formModel.year" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月份" prop="month">
            <el-input v-model.number="formModel.month" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回款金额" prop="backCash">
            <el-input v-model.number="formModel.backCash" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: center">
      <el-button @click="cancle">取消</el-button>
      <el-button @click="saveClick" :loading="submitLoading">确定</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Auth, Layout, Dependencies } from "~/core/decorator";
import { UserBackcashPlanService } from "../../../services/business-service/user-backcash-plan.service";
import { Emit, Watch, Prop } from "vue-property-decorator";
import clone from "clone";

// @Auth(856)
@Layout('workspace')
@Component({
  components: {

  }
})
export default class MonthReturnAmtTemplate extends Vue {
  @Dependencies(UserBackcashPlanService) private userBackcashPlanService: UserBackcashPlanService;
  @Prop() dataCase;

  private formModel: any = {
    userName: '',
    realName: '',
    year: 0,
    backCash: 0,
    month: 0,
    id: ''
  }
  /**
   * 修改委托方信息校验规则
   */
  private rulesUpdate: any = {
    year: [
      { type: 'number', min: 2000, max: 2200, message: '年份范围2000~2200,请重输', trigger: 'blur' }
    ],
    month: [
      { type: 'number', min: 1, max: 12, message: '月份范围1~12,请重输', trigger: 'blur' }
    ],
    backCash: [
      { type: 'number', min: 0, max: 99999999, message: '金额范围0~99999999,请重输', trigger: 'blur' }
    ]
  };
  private submitLoading: Boolean = false;
  mounted() {
    this.formModel.userName = this.dataCase.userName
    this.formModel.realName = this.dataCase.realName
    this.formModel.backCash = this.dataCase.backCash
    this.formModel.year = this.dataCase.year
    this.formModel.month = this.dataCase.month
    this.formModel.companyCode = this.dataCase.companyCode
    this.formModel.id = this.dataCase.id
  }
  refresh(obj) {
    this.formModel = clone(obj);
  }
  /**
   * 取消新增
   */
  cancle() {
    // let modifyForm:any = this.$refs['modify-form']
    //   modifyForm.resetFields()
    this.$emit('close')
  }
  /**
   * 修改确定
   */
  saveClick() {
    let modifyform: any = this.$refs['modify-form']
    modifyform.validate((valid) => {
      if (!valid) {
        return
      }
      this.submitLoading = true;
      this.userBackcashPlanService
        .updateUserBackcashPlan(this.formModel)
        .subscribe(data => {
          this.submitLoading = false;
          this.$message.success('修改成功!')
          let add: any = this.$refs['modify-form']
          add.resetFields()
          this.$emit('refresh')
          this.$emit('close')
        }, ({msg}) => {
          this.submitLoading = false;
          this.$message.error(msg)
        })
    })
  }
}
</script>

<style scoped>

</style>

