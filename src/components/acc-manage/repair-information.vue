<template>
  <section class="component repair-information">
    <el-form :model="params" ref="params" label-width="100px" class="demo-ruleForm text-left">
      <el-form-item label="关系" prop="relation" :rules="[{type:'number',required:true,message:'请选择关系',trigger:'change'}]">
        <el-col :span="8">
          <el-select v-model="params.relation" @change="accTarget">
            <el-option v-for="{label,value} of $dict.getDictData('0015')" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :rules="[{required:true,message:'必须输入姓名',trigger:'blur'},
                    { message: '请输入汉字或英文字母', trigger: 'blur', pattern: /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/ },
                    { min: 2, message: '请输入2位以上汉字或英文字母', trigger: 'blur' }]">
        <el-col :span="8">
          <el-input v-model="params.name" :minlength="2" :maxlength="25"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="电子邮件" prop="mail" :rules="[{ message: '请输入正确的邮箱地址', trigger: 'blur', pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/ },]" v-if="!isCallCollectionType">
        <el-col :span="8">
          <el-input v-model="params.mail"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-col :span="8">
          <el-select v-model="params.phoneStatus" clearable>
            <el-option v-for="{label,value} in $dict.getDictData('0014')" :key="value" :label="label" :value="value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" :offset="3">
          <el-input v-model="params.phone"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-row>
          <el-col :span="8">
            <el-select v-model="params.addressType" clearable>
              <el-option v-for="{label,value} in $dict.getDictData('0018')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8" :offset="3">
            <el-select v-model="params.addressStatus" clearable>
              <el-option v-for="{label,value} in $dict.getDictData('0035')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top:5px">
          <el-col :span="8">
            <el-cascader v-model="params.cityCode" :options="options" clearable></el-cascader>
          </el-col>
          <el-col :span="8" :offset="3">
            <el-input v-model="params.address"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button @click="saveClick" :loading="submitLoading">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Mutation, namespace } from "vuex-class";
import { Layout, Dependencies } from "~/core/decorator";
import { CityService } from "~/utils/city.service";
import { Watch, Prop, Emit } from "vue-property-decorator";
import { AccTelPoolService } from "~/services/business-service/acc-tel-pool.service";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { caseType, followType, sourceType } from "~/config/enum.config";

const accManageModule = namespace("acc-manage");

@Layout("workspace")
@Component({
  components: {
    // FileUpload
  }
})
export default class RepairInformation extends Vue {
  @Dependencies(AccTelPoolService) private accTelPoolService: AccTelPoolService;
  @Dependencies(AccVisitPoolService)
  private accVisitPoolService: AccVisitPoolService;
  @accManageModule.State caseInfo;
  @accManageModule.State caseType;
  @accManageModule.Mutation updateRepayInformation;
  @accManageModule.State searchModel;

  @Emit("close")
  close() {}
  @Emit("refresh")
  refresh() {}

  private params: any = {
    mail: "",
    relation: "",
    name: "",
    phone: "",
    // 联系电话列表
    phoneStatus: "",
    // 联系地址列表
    addressStatus: "",
    addressType: "",
    address: "",
    cityCode: [],
    cityName: [],
    // socialType: '',
    socialNum: "",
    // remark: '',
    id: "",
    fileIds: "",
    idCard: ""
  };
  private showFileList: any = [];
  private options: any = CityService.getCityData();
  private add: any = "";
  private addressAppend: any = "";
  private submitLoading: Boolean = false;

  mounted() {
    // this.loadData()
    // this.setEditState()
  }
  /**
   * 催收对象change(跟进对象反显姓名)
   */
  accTarget() {
    if (this.params.relation === "") {
      return;
    }
    let ContactsInfo = this.caseInfo.personalInfo.personalContacts.find(
      v => v.relation === Number(this.params.relation)
    );
    if (ContactsInfo) {
      this.params.name = ContactsInfo.name;
    } else {
      this.params.name = "";
    }
  }
  /**
   * 获取是否外访、协催类型
   */
  get isCallCollectionType() {
    return (
      this.searchModel.collectionType === caseType.visit ||
      this.searchModel.collectionType === caseType.assist
    );
  }
  /**
   * 取消按钮处理逻辑
   */
  cancel() {
    this.close();
    // 重置
    // this.$refs['params'].resetFields()
    // this.params.socialType = ''
    this.params.phone = "";
    this.params.phoneStatus = "";
    this.params.addressStatus = "";
    this.params.addressType = "";
    this.params.socialNum = "";
    this.params.mail = "";
    this.params.name = "";
    this.params.relation = "";
    this.params.cityCode = [];
    this.params.address = "";
    // this.params.remark = ''
  }
  /**
   * 设置编辑状态
   */
  saveClick() {
    let params: any = this.$refs["params"];
    params.validate(valid => {
      if (!valid) {
        return false;
      }
      if (
        this.params.phoneStatus &&
        this.params.phone &&
        !/^[0-9-()（）]{7,18}$/.test(this.params.phone)
      ) {
        this.$alert("联系电话不合法请重新输入", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      if (this.params.cityCode === [] || this.params.cityCode.length === 0) {
        this.addressAppend === "";
      } else {
        let numberCase: any = this.params.cityCode;
        let actors: any = CityService.getCityName(
          numberCase[0],
          numberCase[1],
          numberCase[2]
        );
        let add: any = actors.join("");
        this.addressAppend = add.concat(this.params.address);
      }
      if (
        this.params.cityCode.length === 0 &&
        this.params.phone === "" &&
        this.params.mail === ""
      ) {
        this.$message("请至少输入一项联系信息");
        return;
      }
      this.submitLoading = true;
      if (this.caseType === 15) {
        this.accTelPoolService
          .saveRepairInfo({
            personalId: this.caseInfo.personalInfo.id,
            relation: this.params.relation,
            name: this.params.name,
            phoneStatus: this.params.phoneStatus,
            phone: this.params.phone,
            // socialType: this.params.socialType,
            socialValue: this.params.socialValue,
            address: this.addressAppend,
            addressStatus: this.params.addressStatus,
            type: this.params.addressType,
            mail: this.params.mail,
            idCard: this.caseInfo.personalInfo.idCard
          })
          .subscribe(
            data => {
              this.$message.success("添加成功!");
              this.submitLoading = false;
              this.cancel();
              this.refresh();
            },
            ({ msg }) => {
              this.$message.error(msg);
            }
          );
      } else {
        this.accVisitPoolService
          .saveRepairInfo({
            personalId: this.caseInfo.personalInfo.id,
            relation: this.params.relation,
            name: this.params.name,
            phoneStatus: this.params.phoneStatus,
            phone: this.params.phone,
            // socialType: this.params.socialType,
            socialValue: this.params.socialValue,
            address: this.addressAppend,
            addressStatus: this.params.addressStatus,
            type: this.params.addressType,
            mail: this.params.mail,
            idCard: this.caseInfo.personalInfo.idCard
          })
          .subscribe(
            data => {
              this.$message.success("添加成功!");
              this.submitLoading = false;
              this.cancel();
              this.refresh();
              // this.updateRepayInformation(data)
            },
            ({ msg }) => {
              this.$message.error(msg);
              this.submitLoading = false;
            }
          );
      }
    });
  }
}
</script>

<style scoped>
</style>
