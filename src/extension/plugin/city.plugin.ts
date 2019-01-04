import Vue from 'vue'
import { CityService } from '~/utils/city.service'

export default {
  install() {
    Vue.prototype.$city = CityService
  }
}
