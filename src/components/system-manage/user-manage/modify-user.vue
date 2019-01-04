<template>
  <section class="component modify-user">
    <el-form :rules="rules" :model="modifyModel" ref="modifyUser-form" label-width="100px" align="left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="modifyModel.userName" size="small" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="modifyModel.realName" size="small" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话呼叫绑定的通道号码" prop="channelNo">
            <el-input v-model="modifyModel.channelNo" size="small" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主叫电话的区号" prop="zoneno">
            <el-input v-model="modifyModel.zoneno" size="small" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="modifyModel.phone" size="small" :maxlength="13"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="modifyModel.email" size="small" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="companyNames">
            <el-select size="small" v-model="modifyModel.companyCode" disabled>
              <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code" ref="companyNames"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属机构">
            <el-cascader v-model="deptIds" :options="departmentData" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" @change="orgChange"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="modifyModel.age" size="small" :maxlength="25" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工龄" prop="workAge">
            <el-input v-model="modifyModel.workAge" size="small" :maxlength="25" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="户籍地址" min-width="140px" prop="residence">
            <el-cascader v-model="residence" :options="options" clearable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="modifyModel.sex" size="small">
              <el-option v-for="{value,label} in $dict.getDictData('0055')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="民族" prop="nation">
            <el-select v-model="modifyModel.nation" clearable>
              <el-option v-for="{value,label} in $dict.getDictData('0056')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="modifyModel.status" size="small">
              <el-option label="启用" :value="504"></el-option>
              <el-option label="停用" :value="505"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否管理员" min-width="140px">
            <el-select v-model="modifyModel.manager" size="small">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="催收类型" prop="degrId">
            <el-select v-model="modifyModel.type" placeholder="请选择" size="small" disabled>
              <el-option v-for="{value,label} in this.$dict.getDictData('0001')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="绑定主叫号码" min-width="140px" prop="callPhone">
            <el-input v-model="modifyModel.callPhone" size="small" :maxlength="13"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="催收员等级" prop="collectionGrade">
            <el-select v-model="modifyModel.collectionGrade" clearable>
              <el-option v-for="{value,label} in $dict.getDictData('0100')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="分案开关" prop="divisionSwitch">
            <el-select v-model="modifyModel.divisionSwitch" clearable>
              <el-option v-for="{value,label} in $dict.getDictData('0101')" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-col :span="20">
          <el-input type="textarea" v-model="modifyModel.remark" :autosize="{ minRows:2, maxRows:4}" :maxlength="500"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item scope="scope" label-width="0px" align="center">
        <el-button @click="modifyUserCancel">取消</el-button>
        <el-button @click="commit" :loading="submitLoading">确定</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { State, Getter } from "vuex-class";
import { UserService } from "~/services/business-service/user.service";
import { CityService } from "~/utils/city.service";
import { Emit } from "vue-property-decorator";
import clone from "clone";

@Component({
  components: {}
})
export default class ModifyUser extends Vue {
  @Dependencies(UserService) private userService: UserService;
  @State companyList: any;
  @State departmentList: any;
  @Getter departmentData;
  @Getter isSupperAdmin: boolean;

  @Emit("refreshList")
  refreshList() { }
  @Emit("close")
  close() { }

  private options: any = CityService.getCityData();
  private modifyModel: any = {
    channelNo: "",
    zoneno: "",
    userName: "",
    realName: "",
    phone: "",
    email: "",
    status: 0,
    remark: "",
    manager: 0,
    messagePushId: "",
    callPhone: "",
    companyCode: "",
    type: "",
    field: "",
    sex: "",
    department: {},
    loginAddress: 1,
    loginDevice: 1,
    loginType: "",
    photo: "",
    signature: "",
    age: "",
    workAge: "",
    nation: "",
    residence: ""
  };
  private rules: any = {
    realName: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      {
        message: "请输入汉字或英文字母",
        trigger: "blur",
        pattern: /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/
      }
    ],
    userName: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        message: "用户名只能包含数字、字母、下划线",
        trigger: "blur",
        pattern: /^([A-Za-z0-9_-]+)$/
      },
      { min: 6, message: "请输入6位以上数字、字母、下划线", trigger: "blur" }
    ],
    phone: [
      {
        message: "请输入正确的电话号码",
        trigger: "blur",
        pattern: /^[-0-9()（）]{7,18}$/
      }
    ],
    callPhone: [
      {
        message: "请输入正确的电话号码",
        trigger: "blur",
        pattern: /^[-0-9()（）]{7,18}$/
      }
    ],
    email: [
      { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
      { min: 1, max: 50, message: "邮箱长度不能超过50位", trigger: "blur" }
    ],
    age: [
      {
        message: "年龄必须大于15小于60",
        trigger: "blur",
        pattern: /^1[6-9]$|^[2-5]\d$|^60$/
      }
    ],
    workAge: [
      {
        message: "工龄必须为0~45之间的整数",
        min: 1,
        max: 2,
        trigger: "blur",
        pattern: /^[0-9]$|^[1-3][0-9]$|^4[0-5]$/
      }
    ]
  };

  private residence: any = [];
  private prinCityid: any = "";
  private prinPrid: any = "";
  private deptIds: any = [];
  private submitLoading: Boolean = false;

  /**
  * 机构改变
  */
  orgChange(value) {
    if (this.deptIds.length < 1) {
      return
    }

    let deptId = this.deptIds[this.deptIds.length - 1]
    let deptModel: any = this.departmentList.find(x => x.id === deptId)
    this.modifyModel.department = deptModel
    this.modifyModel.type = deptModel.type
  }

  getDeptIds(id: string) {
    let dept = this.departmentList.find(x => x.id === id)
    if (dept) {
      this.deptIds.unshift(id)
      if (dept.parentId) {
        this.getDeptIds(dept.parentId)
      }
    }
  }

  /**
  * 新增用户取消
  */
  modifyUserCancel() {
    //   重置form表单
    let addForm: any = this.$refs["modifyUser-form"];
    addForm.resetFields()
    this.deptIds = [];
    //   关闭dialog
    this.$emit("close");
  }

  reset() {
    let modifyForm: any = this.$refs["modifyUser-form"];
    modifyForm.resetFields();
  }

  refresh(obj) {
    this.modifyModel = clone(obj);

    this.deptIds = []
    this.getDeptIds(this.modifyModel.department.id)
  }
  commit() {
    let modifyForm: any = this.$refs["modifyUser-form"];
    modifyForm.validate(valid => {
      if (!valid) return false;
      this.submitLoading = true;
      let [prinPrid, prinCityid, prinCtyid] = this.residence;
      this.prinPrid = prinPrid;
      this.prinCityid = prinCityid;
      this.modifyModel.residence = prinCtyid;
      this.userService.updateUser(this.modifyModel).subscribe(
        data => {
          this.submitLoading = false;
          this.reset()
          this.$emit("close");
          this.$message.success("修改成功!");
          //   刷新databox
          this.$emit("refresh");
        }, ({ msg }) => {
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
