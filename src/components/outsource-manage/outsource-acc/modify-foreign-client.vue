<template>
  <section class="component modify-foreign-client">
    <el-form :rules="rules" :model="forms" ref="foreign-form" label-width="100px" class="text-left">
      <el-row>
        <el-col :span='12'>
          <el-form-item label="受托方" prop="outsName">
            <el-input v-model="forms.outsName"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span='12'>
          <el-form-item label="状态">
            <el-radio-group v-model="forms.flag">
              <el-radio label="0">启用</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span='12'>
          <el-form-item label="优先级" prop="outsLevel">
            <el-select v-model="forms.outsLevel" placeholder="请选择" clearable>
              <el-option v-for="{value,label} in outsLevelList" :key="value" :label="label" :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col  :span='12'>
          <el-form-item label="机构类型" prop="outsOrgtype">
            <el-radio-group v-model="forms.outsOrgtype">
              <el-radio v-for="{value,label} in $dict.getDictData('0036')" :label="value" :key="value" disabled>{{label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合约时间" prop="contractTime">
            <el-date-picker v-model="forms.contractTime" type="daterange" :editable="false" format value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省份/城市" prop="cityList">
            <el-cascader v-model="forms.cityList" :options="$city.getCityData({ level : 2 })" clearable></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-form-item label="详细地址" prop="outsAddress">
            <el-input type="textarea" v-model="forms.outsAddress" :rows="2"></el-input>
          </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="companyCode" v-show="isSupperAdmin">
            <el-select size="small" v-model="forms.companyCode">
              <el-option v-for="item in companyList" :label="item.chinaName" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='12'>
          <el-form-item label="联系人" prop="outsContacts">
            <el-input v-model="forms.outsContacts"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="联系电话" prop="outsPhone">
            <el-input v-model="forms.outsPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="手机号" prop="outsMobile">
            <el-input v-model="forms.outsMobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label="邮箱" prop="outsEmail">
            <el-input v-model="forms.outsEmail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="可催收区域" prop="areaList">
        <el-button type="primary" size="small" @click="dialog.area=true">选择区域</el-button>
        <span style="padding:5 0 0 5px;color:red;">您选择了{{forms.areaList.length}}个城市</span>
      </el-form-item>
      <el-form-item label="备注" prop="outsRemark">
        <el-input type="textarea" v-model="forms.outsRemark" :maxlength="500"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:20px">
      <el-button @click="cancelClick">取消</el-button>
      <el-button @click="confirm" :loading="submitLoading">确定</el-button>
    </div>
    <el-dialog title="选择区域" :center="true" :visible.sync="dialog.area" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body @close="selectedCitysClose">
      <area-selection :selectedCitys="forms.selectedCitysList" ref="area-selection"></area-selection>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialog.area = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop, Emit } from "vue-property-decorator";
import { State, Getter } from "vuex-class";
import { OutsourceService } from "~/services/business-service/outsource.service";
import clone from "clone";
import AreaSelection from "~/components/common/area-selection.vue";

@Component({
  components: {
    AreaSelection
  }
})
export default class ModifyForeignClient extends Vue {
  @Dependencies(OutsourceService) private outsourceService: OutsourceService;

  @State userData: any;
  @State companyList: any;
  @Getter isSupperAdmin: boolean;

  @Emit("close")
  close() {}
  @Emit("refreshList")
  refreshList() {}

  private dialog: any = {
    area: false
  };
  private validateTime = (rule, value, callback) => {
    let start = value[0];
    let end = value[1];
    if (start >= end) {
      callback(new Error("合约结束时间必须大于开始时间"));
    } else {
      callback();
    }
  };
  private rules: any = {
    outsContacts: [
      {
        message: "请输入汉字或英文字母",
        trigger: "blur",
        pattern: /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/
      }
    ],
    contractTime: [
      {
        required: true,
        message: "请选择合约时间",
        trigger: "blur"
      },
      { validator: this.validateTime, trigger: "blur" }
    ],
    outsName: [
      {
        required: true,
        message: "请输入受托方",
        trigger: "blur"
      }
    ],
    outsLevel: [
      {
        required: true,
        message: "请选择优先级",
        trigger: "blur"
      }
    ],
    areaList: [
      {
        required: true,
        message: "请选择可催收区域",
        trigger: "blur"
      }
    ],
    flag: [
      {
        required: true,
        message: "请选择状态",
        trigger: "blur"
      }
    ],
    outsMobile: [
      {
        message: "请输入正确的手机号",
        trigger: "blur",
        pattern: /^1(3|4|5|7|8)\d{9}$/
      }
    ],
    outsPhone: [
      {
        message: "请输入正确的电话号码",
        trigger: "blur",
        pattern: /^[-0-9()（）]{7,18}$/
      }
    ],
    outsEmail: [
      {
        message: "请输入正确的邮箱",
        trigger: "blur",
        type: "email"
      },
      {
        min: 1,
        max: 50,
        message: "邮箱长度不能超过50位",
        trigger: "blur"
      }
    ],
    outsOrgtype: [
      {
        required: true,
        type: "number",
        message: "请选择机构类型",
        trigger: "change"
      }
    ]
  };
  private forms: any = {
    id: "",
    outsCode: "",
    outsName: "",
    outsOrgtype: "",
    outsAddress: "",
    outsContacts: "",
    outsMobile: "",
    outsPhone: "",
    outsEmail: "",
    outsRemark: "",
    selectedCitysList: [],
    cityList: [],
    companyCode: "",
    flag: "",
    areaList: [],
    outsLevel: "",
    contractTime: [],
    areaId: ""
  };
  private areaPopover: any = false;
  private submitLoading: Boolean = false;
  selectedCitysClose() {
    let selectedCitys: any = this.$refs["area-selection"];
    this.forms.areaList = selectedCitys.getCheckedCitys();
  }
  cancelClick() {
    this.close();
  }
  get outsLevelList() {
    let LevelList: Array<any> = [];
    for (let i = 1; i <= 20; i++) {
      LevelList.push({ value: i, label: i });
    }
    return LevelList;
  }
  confirm() {
    let foreignForm = <any>this.$refs["foreign-form"];
    foreignForm.validate(validate => {
      if (!validate) {
        return;
      }
      this.submitLoading = true;
      let [prinPrid, prinCityid, prinCtyid] = this.forms.cityList;
      this.forms.areaId = prinCtyid || prinCityid || prinPrid;
      this.outsourceService.createOutsource(this.forms).subscribe(
        data => {
          this.submitLoading = false;
          this.$message.success("修改成功!");
          this.refreshList();
          this.close();
          foreignForm.resetFields();
        },
        ({ msg }) => {
          this.submitLoading = false;
          this.$message.error(msg);
        }
      );
    });
  }
  /**
   * 信息反显
   */
  refreshData(row) {
    this.forms.id = row.id;
    this.forms.outsCode = row.outsCode;
    this.forms.areaList = this.forms.selectedCitysList = row.areaCodes.map(
      v => v.id
    );
    this.forms.flag = row.flag.toString();
    this.forms.outsContacts = row.outsContacts;
    this.forms.outsName = row.outsName;
    this.forms.outsOrgtype = row.outsOrgtype;
    this.forms.outsAddress = row.outsAddress;
    this.forms.outsContact = row.outsContact;
    this.forms.outsMobile = row.outsMobile;
    this.forms.outsPhone = row.outsPhone;
    this.forms.outsEmail = row.outsEmail;
    this.forms.outsRemark = row.outsRemark;
    this.forms.companyCode = row.companyCode;
    this.forms.outsLevel = row.outsLevel;
    this.forms.contractTime = [row.contractStartTime, row.contractEndTime];
    this.forms.cityList = [this.$city.getCityParent(row.areaId)[0], row.areaId];
  }
}
</script>
<style lang='less' scoped>
.el-date-editor .el-range-input,
.el-date-editor .el-range-separator {
  font-size: 13px;
}
.el-date-editor--daterange,
.el-dialog .component .el-date-editor--daterange {
  width: 222px;
}
</style>
