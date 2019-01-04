<template>
  <section class="page visit-monitor">
    <data-form :model="visitModle" @onSearch="refreshData">
      <!--输入区域-->
      <template slot="default-input">
        <el-form-item label="机构" prop="deptId" v-auth="5199">
          <el-cascader v-model="visitModle.deptIds" @change="getcupoName"  :options="visitDepartmentData" :props="{value:'id',label:'name'}" change-on-select :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="当前催收员" prop="cupoName" v-auth="5200">
          <el-select v-model="visitModle.cupoName" @focus="getUserList" >
            <el-option v-for="item in userList" :key="item.id" :value="item.realName" :label="item.realName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="Time" v-auth="5201">
          <el-date-picker v-model="visitModle.Time" type="datetimerange" placeholder="选择时间" :editable="false" range-separator="~">
          </el-date-picker>
        </el-form-item>
      </template>
    </data-form>
    <div class="db-map">
      <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
        <el-amap-marker v-for="(marker, i) in markers" :key="'a'+i"  :content="marker.content" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        <el-amap-info-window v-for="(window,i) in windows" :key="'b'+i" :position="window.position" :content="window.content" :visible="window.visible" :events="window.events"></el-amap-info-window>
      </el-amap>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Auth,Layout,Dependencies } from "~/core/decorator";
  import DataForm from "~/components/common/data-form.vue";
  import Map from "~/components/common/map.vue";
  import { Getter } from "vuex-class";
  import { MobilePositionService } from "~/services/reminder-service/mobile-position.service";
  import { FilterService } from '~/utils/filter.service';
  import { CoordinateService } from '~/utils/coordinate.service';
  import { UserService } from '~/services/business-service/user.service';

  @Auth(188)
  @Layout('workspace')
  @Component({
    components:{
      DataForm,
      Map
    }
  })
  export default class VisitMonitor extends Vue {
    @Dependencies(MobilePositionService) private mobilePositionService: MobilePositionService;
    @Getter visitDepartmentData;
    @Dependencies(UserService) private userService: UserService;
    
    private lastdeptId = ''
    private visitModle: any = {
      deptId:'',
      deptIds: [],
      cupoName: '',
      Time: [],
      userId: ''
    }
    private userList : any = [];
    private markers: any = [];
    private windows: any = [];
    private center: any = [108, 34];
    private zoom: any = 4;
    private changeValue : any = {
      id: '',
    };
    refreshData() {
      if(!this.visitModle.Time||!this.visitModle.Time[0]) {
        this.$alert('请选择时间区间', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      this.mobilePositionService.getLatitudeAndLongitude({
        deptId: this.visitModle.deptIds[this.visitModle.deptIds.length-1],
        name: this.visitModle.cupoName,
        startDate: FilterService.dateRanageFormat(this.visitModle.Time).start,
        endDate: FilterService.dateRanageFormat(this.visitModle.Time).end
      }).subscribe(data => {
          
          let self = this
          this.windows = data.map((v, i) => {
            let pos: any = CoordinateService.convert({ origin: 'bd', data: { lat: v.latitude, lng: v.longitude }, target: 'gcj' })
            let time: any = FilterService.dateFormat(v.datetime, 'yyyy-MM-dd hh:mm:ss')
            return {
              position: [
                pos.lon,
                pos.lat
              ],
              content: `<div class="prompt">姓名：${v.realName}</div><div class="prompt">时间：${time}</div><div class="prompt">地址：${v.address || ''}</div>`,
              visible: false,
              events: {
                close() {}
              }
            }
          })
          this.markers = data.map((v, i) => {
            let pos: any = CoordinateService.convert({ origin: 'bd', data: { lat: v.latitude, lng: v.longitude }, target: 'gcj' })
            return {
              position: [
                pos.lon,
                pos.lat
              ],
              events: {
                click() {
                  self.windows.forEach(window => {
                    window.visible = false
                  })
                  self.$nextTick(() => {
                    self.windows[i].visible = true
                  })
                }
              }
            }
          })
          if (data.length > 0) {
            this.center = [parseFloat(data[0].longitude), parseFloat(data[0].latitude)]
          } else {
            this.$message.error('没有位置信息')
          }
      }, ({ msg }) => {
        this.$message.error(msg);
      });
    }

    getUserList(){   
      if( this.visitModle.deptId === this.lastdeptId){
        return
      }

      this.lastdeptId = this.visitModle.deptId
      this.userService.queryNoPage(this.lastdeptId).subscribe(
         data => this.userList = data,
         err => this.$message.error(err.msg)
      )
    }

    /**
     * 根据部门获取催收员
     */
    getcupoName() {
      
      if (this.visitModle.deptIds.length > 0) {
        this.visitModle.deptId = this.visitModle.deptIds[
          this.visitModle.deptIds.length - 1
        ];
      } else {
        this.visitModle.deptId = "";
      }
    }
    
  }
</script>

<style lang="less">
  .db-map {
    margin: 0px;
    width: 100%;
    height: 600px;
  }

  .amap-demo {
    height: 700px;
    width: auto;
  }

  .prompt {
    background: white;
    width: 100px;
    height: 30px;
    text-align: center;
  }
</style>
