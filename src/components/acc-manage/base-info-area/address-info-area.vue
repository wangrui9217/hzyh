<template>
  <section class="component address-info-area">
    <el-card class="box-card">
      <div slot="header" class="row between-span" style="height:28px">
        <div>地址簿</div>
      </div>
      <data-box :data="addressData" @onPageChange="refreshData" :height="300" ref="data-box">
        <template slot="columns">
          <el-table-column prop="relation" label="关系" :min-width="$helper.getColumnWidth(2)">
            <template slot-scope="scope">
              <span>{{scope.row.relation | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" :min-width="$helper.getColumnWidth(3)">
          </el-table-column>
          <el-table-column prop="type" label="地址类型" :min-width="$helper.getColumnWidth(5)">
            <template slot-scope="scope">
              <span>{{scope.row.type | dictConvert}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="detail" label="地址明细" :min-width="$helper.getColumnWidth(8)" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="text-left">
                <el-button type="text" @click="showMap(scope)" v-if="scope.row.detail">{{scope.row.detail}}</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </data-box>
    </el-card>
    <!--地图-->
    <el-dialog :visible.sync="dialog.map" title="位置信息" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo" style="height:450px">
        <el-amap-marker v-for="(marker, i) in markers" :key="'a'+i" :content="marker.content" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        <el-amap-info-window v-for="(window,i) in windows" :key="'b'+i" :position="window.position" :content="window.content" :visible="window.visible" :events="window.events"></el-amap-info-window>
      </el-amap>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Mutation, namespace } from "vuex-class";
import Component from "vue-class-component";
import DataBox from "~/components/common/data-box.vue";
import { AccVisitPoolService } from "~/services/business-service/acc-visit-pool.service";
import { Layout, Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { Watch } from "vue-property-decorator";
import { CoordinateService } from '~/utils/coordinate.service';
import { FilterService } from '~/utils/filter.service';
import { PersonalService } from '~/services/business-service/personal.service';

const accManageModule = namespace("acc-manage");

@Component({
  components: {
    DataBox
  }
})
export default class AddressInfoArea extends Vue {
  @Dependencies(AccVisitPoolService) private accVisitPoolService: AccVisitPoolService;
  @Dependencies(PersonalService) private personalService: PersonalService;

  @accManageModule.State caseInfo;

  private center: any = [0, 0]
  private windows: any = []
  private markers: any = []
  private zoom: any = 14
  private addressData: any = [];
  private dialog: any = {
    map: false
  };
  @Watch("caseInfo")
  onCaseIdChange() {
    this.refreshData();
  }
  showMap(scope) {
    this.personalService.getMapInfo(scope.row.detail).subscribe(
      data => {
        if(!data){
          this.$message.error('没有找到位置信息')
          return
        }
        this.dialog.map = true
        let adds: any = CoordinateService.convert({ origin: 'bd', data: { lat: data.latitude, lng: data.longitude }, target: 'gcj' })
        let self: any = this
        this.windows.push({
          position: [
            adds.lon,
            adds.lat
          ],
          content: data.detail,
          visible: true,
          events: {
            close() { }
          }
        })
        this.markers.push({
          position: [
            adds.lon,
            adds.lat
          ],
          events: {
            click() {
              self.windows.forEach(window => {
                window.visible = false
              })
              self.$nextTick(() => {
                self.windows[0].visible = true
              })
            }
          }
        })
        this.center = [parseFloat(adds.lon), parseFloat(adds.lat)]
      },
      ({ msg }) => this.$message.error(msg))
  }
  mounted() {
    this.refreshData();
  }
  refreshData() {
    let caseData: any = {
      personalId: this.caseInfo.personalInfo ? this.caseInfo.personalInfo.id : "", type: 1    };
    this.accVisitPoolService.getVisitPersonalAddress(caseData).subscribe(
      data => this.addressData = data,
      ({ msg }) => this.$message.error(msg))
  }
}
</script>

<style lang="less" scoped>

</style>
