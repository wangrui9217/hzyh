<template>
  <section class="component add-work-flow">
    <el-form ref="form" :rules="rules" :model="params">
      <el-form-item label="任务名称" prop="taskName" align="left">
        <el-col>
          <el-input v-model="params.taskName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="任务详情" align="left">
        <el-col>
          <el-button @click="taskNodeList.push({roleId:''})">增加</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-table :data="taskNodeList">
      <el-table-column label="当前步骤">
        <template slot-scope="scope">
          {{scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <el-select v-model="scope.row.roleId" placeholder="请选择角色名称">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.$index === 0" type="text" @click="move(option.UP,scope.$index)">上移</el-button>
          <el-button :disabled="scope.$index === taskNodeList.length - 1" type="text" @click="move(option.Down,scope.$index)">下移</el-button>
          <el-button @click="taskNodeList.splice(scope.$index, 1)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top:30px">
      <el-button @click="cancelAdd">取消</el-button>
      <el-button @click="confirmAdd" :loading="submitLoading">确定</el-button>
    </el-row>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Dependencies } from "~/core/decorator";
import { Prop } from "vue-property-decorator";
import { ProcessInfoService } from "~/services/business-service/process-info.service";
import { RoleService } from "~/services/business-service/role.service";

@Component({
  components: {}
})
export default class AddWorkFlow extends Vue {
  @Dependencies(ProcessInfoService)
  private processInfoService: ProcessInfoService;
  @Dependencies(RoleService) private roleService: RoleService;

  @Prop() existedTaskNames;

  private params: any = {
    taskName: "", // 任务节点列表
    list: "" // 任务节点列表
  };
  private taskNodeList: any = [];
  private rules: any = {
    taskName: [
      { trigger: "blur", required: true, message: "请输入任务名称" },
      { validator: this.validatorTaskName, trigger: "blur" }
    ]
  };
  private option: any = {
    // 操作选项
    UP: 0,
    DOWN: 1
  };
  private roleList: any = []; // 所有的角色，列表
  private submitLoading: Boolean = false;
  mounted() {
    // 获取所有资源
    this.roleService
      .queryAllRole()
      .subscribe(
        data => (this.roleList = data),
        err => this.$message.error(err.msg)
      );
  }
  validatorTaskName(rule, value, callback) {
    if (this.existedTaskNames.includes(value)) {
      callback(new Error("任务名称已存在"));
    }
    callback();
  }
  // 节点移动
  move(type, index) {
    let current = this.taskNodeList[index];
    let chage = {};
    if (type === this.option.UP) {
      chage = this.taskNodeList[index - 1];
      this.taskNodeList.splice(index - 1, 2, current, chage);
    } else {
      chage = this.taskNodeList[index + 1];
      this.taskNodeList.splice(index, 2, chage, current);
    }
  }
  // 取消按钮 关闭窗体
  cancelAdd() {
    this.params.taskName = "";
    this.params.list = "";
    this.taskNodeList = [];
    this.$emit("close");
  }

  // 检测错误
  checkError() {
    let hasError = false;
    for (let i = 0; i < this.taskNodeList.length; i++) {
      if (this.taskNodeList[i].roleId === "") {
        this.$message(`请选择第${i + 1}步的角色`);
        hasError = true;
        break;
      }
    }
    return hasError;
  }
  // 提交按钮
  confirmAdd() {
    let required = true;
    this.submitLoading = true;
    // form表单检测
    let dataForm: any = this.$refs["form"];
    dataForm.validate(v => {
      required = v;
    });
    // 任务节中含有空数据或者表单验证不通过
    if (this.checkError() || !required) {
      return;
    }

    let step = 0;
    this.params.list = this.taskNodeList.map(element => {
      step += 1;
      return Object.assign({ step }, element);
    });

    if (step < 2) {
      this.$message.error("步骤不能少于2步");
      return;
    }
    this.processInfoService.saveProcessTask(this.params).subscribe(
      data => {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.submitLoading = false;
        this.cancelAdd();
        this.$emit("refresh");
        this.params.taskName = "";
        this.params.list = "";
        this.taskNodeList = [];
      },
      err => {
        this.$message.error(err.msg);
        this.submitLoading = false;
      }
    );
  }
}
</script>

<style lang="less">
.component.add-work-flow {
  .el-input,
  .el-input__inner {
    min-height: 26px;
    height: auto;
    width: 178px;
  }
}
</style>