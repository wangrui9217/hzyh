<template>
  <section class="component facility-manage">
    <el-col>
      <div class="facility-title">当前用户名:{{userObj.userName}}</div>
    </el-col>
    <data-box :data="dataSet">
      <template slot="columns">
        <!--数据列区域-->
        <el-table-column prop="type" label="类型" align="center" :min-width="$helper.getColumnWidth(3)">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">PC端</span>
            <span v-if="scope.row.type == 1">移动端</span>
          </template>
        </el-table-column>
        <el-table-column prop="flag" label="是否禁用" align="center" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">否</span>
            <span v-if="scope.row.status == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="validate" label="设备锁状态" align="center" :min-width="$helper.getColumnWidth(4)">
          <template slot-scope="scope">
            <span v-if="scope.row.validate == 1">停用</span>
            <span v-if="scope.row.validate == 0">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :min-width="$helper.getColumnWidth(5)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===1" @click="hangleFacility(scope,0)" type="text" size="small">启用设备</el-button>
            <el-button v-else @click="hangleFacility(scope,1)" type="text" size="small">禁用设备</el-button>
            <el-button v-if="scope.row.validate===1" @click="hangleLock(scope,0)" type="text" size="small">启用设备锁</el-button>
            <el-button v-else @click="hangleLock(scope,1)" type="text" size="small">停用设备锁</el-button>
            <el-button @click="resetfacility(scope)" type="text" size="small">重置设备</el-button>
          </template>
        </el-table-column>
      </template>
    </data-box>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { LoginService } from "~/services/business-service/login.service";

@Component({
  components: {
    DataBox
  }
})
export default class FacilityManage extends Vue {
  @Dependencies(LoginService) private loginService: LoginService;
  private userObj: any = {};
  private dataSet: any = [];
  refresh(obj) {
    this.dataSet = []
    this.dataSet = obj.userDevices.filter(v => v.type==0)
    this.userObj = obj
  }
  /**
   * 启用禁用设备
   */
  hangleFacility(scope, handle) {
    this.$confirm(`您确定要对用户${this.userObj.userName}执行该操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let hangleFacility:any = {
        userIds: [this.userObj.id],
        usdeType: scope.row.type,
        usdeStatus: handle
      }
      this.loginService.disableDevice(hangleFacility).subscribe(data => {
        scope.row.status = handle
        // 更新数据信息
        this.$message.success('操作成功')
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    })
  }
  /**
   * 启用停用设备锁
   */
  hangleLock(scope, handle) {
    this.$confirm(`您确定要对用户${this.userObj.userName}执行该操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let hangleLock:any = {
       userIds: [this.userObj.id], 
       usdeType: scope.row.type, 
       validate: handle 
      }
      this.loginService.enableDeviceKey(hangleLock).subscribe(data => {
        scope.row.validate = handle
        // 更新数据信息
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    })
  }
  /**
   * 重置设备
   */
  resetfacility(scope) {
    this.$confirm(`您确定要对用户${this.userObj.userName}执行该操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loginService.resetDevice({ userIds: [this.userObj.id], usdeType: scope.row.type, validate: 0, usdeStatus: 0 }).subscribe(data => {
        scope.row.code = ''
        // 更新数据信息
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    })
  }
}

</script>

<style lang="less" scoped>
.facility-title {
  margin: 10px 0;
  font-size: 0.875rem;
  color: rgb(31, 45, 61);
  text-align: left;
}
</style>
