import Vue from 'vue'
import { CoordinateService } from '~/utils/coordinate.service'

export default {
  install() {
    Vue.prototype.$coordinate = CoordinateService
  }
}
