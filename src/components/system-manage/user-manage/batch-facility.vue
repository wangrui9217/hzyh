<template>
  <section class="component batch-facility">
    <!-- <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="PC端" name="pcTable"> -->
        <el-row style="text-align:center">
          <el-button @click="hangleFacility(0,0)" size="small">一键启用设备</el-button>
          <el-button @click="hangleFacility(0,1)" size="small">一键禁用设备</el-button>
          <el-button @click="hangleLock(0,0)" size="small">一键启用设备锁</el-button>
          <el-button @click="hangleLock(0,1)" size="small">一键停用设备锁</el-button>
          <el-button @click="resetfacility(0)" size="small">一键重置设备</el-button>
        </el-row>
        <el-row style="padding:10px;min-height:300px">
          <data-box :data="pc.data" ref="pctable" :selectionList.sync="pc.selectionList">
            <template slot="columns">
              <el-table-column prop="userName" label="用户名" min-width="100px">
              </el-table-column>
              <el-table-column prop="type" label="类型" min-width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 0">PC端</span>
                  <span v-if="scope.row.type == 1">移动端</span>
                </template>
              </el-table-column>
              <el-table-column prop="flag" label="是否禁用" min-width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">否</span>
                  <span v-if="scope.row.status == 1">是</span>
                </template>
              </el-table-column>
              <el-table-column prop="validate" label="设备锁状态" min-width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.validate == 1">停用</span>
                  <span v-if="scope.row.validate == 0">启用</span>
                </template>
              </el-table-column>
            </template>
          </data-box>
        </el-row>
      <!-- </el-tab-pane> -->
      <!-- <el-tab-pane label="移动端" name="movingTable">
        <el-row style="padding:20px 0">
          <el-button @click="hangleFacility(1,0)" size="small">一键启用设备</el-button>
          <el-button @click="hangleFacility(1,1)" size="small">一键禁用设备</el-button>
          <el-button @click="hangleLock(1,0)" size="small">一键启用设备锁</el-button>
          <el-button @click="hangleLock(1,1)" size="small">一键停用设备锁</el-button>
          <el-button @click="resetfacility(1)" size="small">一键重置设备</el-button>
        </el-row>
        <el-row style="padding:10px;min-height:300px">
          <data-box :data="moving.data" ref="movingtable" :selectionList.sync="moving.selectionList">
            <template slot="columns">
              <el-table-column prop="userName" label="用户名" min-width="100px">
              </el-table-column>
              <el-table-column prop="type" label="类型" min-width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 0">PC端</span>
                  <span v-if="scope.row.type == 1">移动端</span>
                </template>
              </el-table-column>
              <el-table-column prop="flag" label="是否禁用" min-width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">是</span>
                  <span v-if="scope.row.status == 0">否</span>
                </template>
              </el-table-column>
              <el-table-column prop="validate" label="设备锁状态" min-width="100px">
                <template slot-scope="scope">
                  <span v-if="scope.row.validate == 1">停用</span>
                  <span v-if="scope.row.validate == 0">启用</span>
                </template>
              </el-table-column>
            </template>
          </data-box>
        </el-row>
      </el-tab-pane> -->
    <!-- </el-tabs> -->
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { Dependencies } from "~/core/decorator";
import { LoginService } from "~/services/business-service/login.service";
import { Emit } from "vue-property-decorator";

@Component({
  components: {
    DataBox
  }
})
export default class BatchFacility extends Vue {
  @Dependencies(LoginService) private loginService: LoginService;
  @Emit('refreshList')
  refreshList() { }
  private activeName: any = 'pcTable';
  private pc: any = {
    data: [],
    selectionList: []
  };
  private moving: any = {
    data: [],
    selectionList: []
  };

  refresh(arr) {
    let allArr: any = []
    arr.forEach((v) => {
      let arr = v.userDevices.map((val) => {
        val.userName = v.userName
        val.userId = v.id
        return val
      })
      allArr = allArr.concat(arr)
    })
    this.moving.data = allArr.filter(v => v.type === 1)
    this.pc.data = allArr.filter(v => v.type === 0)
  }
  /**
   * 启用禁用设备
   */
  hangleFacility(type, handle) {
    this.$confirm(`您确定要执行该操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let userIds: any = []
      if (type === 0) {
        userIds = this.pc.selectionList
      } else {
        userIds = this.moving.selectionList
      }
      this.loginService.disableDevice({ userIds: userIds.map(v => v.userId), usdeType: type, validate: 0, usdeStatus: handle }).subscribe(data => {
        userIds.forEach((v) => {
          if (v.type === type) {
            v.status = handle
          }
        })
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
  hangleLock(type, handle) {
    if(this.pc.selectionList.length===0 && this.moving.selectionList.length===0){
      this.$message({
        type: 'warning',
        message: '请选择用户!'
      })
      return
    }

    this.$confirm(`您确定要执行该操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let userIds: any = []
      if (type === 0) {
        userIds = this.pc.selectionList
      } else {
        userIds = this.moving.selectionList
      }
      this.loginService.enableDeviceKey({ userIds: userIds.map(v => v.userId), usdeType: type, validate: handle, usdeStatus: handle }).subscribe(data => {
        userIds.forEach((v) => {
          if (v.type === type) {
            v.validate = handle
          }
        })
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
  resetfacility(type) {
    this.$confirm(`您确定要执行该操作吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let userIds: any = []
      if (type === 0) {
        userIds = this.pc.selectionList
      } else {
        userIds = this.moving.selectionList
      }
      this.loginService.resetDevice({ userIds: userIds.map(v => v.userId), usdeType: type, validate: 0, usdeStatus: 0 }).subscribe(data => {
        // 更新数据信息
        userIds.forEach((v) => {
          if (v.type === type) {
            v.code = ''
          }
        })
        this.refreshList()
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
.header {
  margin: 10px 0;
  font-size: 0.875rem;
  color: rgb(31, 45, 61);
  text-align: left;
}
</style>
