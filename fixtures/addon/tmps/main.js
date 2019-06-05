import Vue from 'vue'
import { HmMap as Map, transpile } from 'hexamaps'
import config from '../config'
import addons from './addons'

const plugins = transpile(addons)

const HmMap = Map(plugins)
const App = {
  name: 'HexaMap',
  render: function (createElement) {
    return createElement (
      HmMap,
      {props:
        {
          projectionName: this.projectionName,
          withGraticule: this.withGraticule
        }
      }
    )
  },
  data () {
    return {
      data: [],
      source: config.mapSource,
      projectionName: config.projectionName,
      withGraticule: config.withGraticule
    }
  },
  mounted () {
    this.load(config.dataSource)
  },
  provide () {
    const map = {data: [], source: ''}
    Object.defineProperty(map, 'data', {
       enumerable: true,
       get: () => this.data
    })
    Object.defineProperty(map, 'source', {
       enumerable: true,
       get: () => this.source
    })
    return { map }
  },
  methods: {
    load (dataSource) {
      fetch(dataSource)
        .then(response => {
          return response.json()
        })
        .then(json => {
          this.data = json
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}

Vue.config.productionTip = false

Vue.use(plugins.entry)

new Vue({
  render: h => h(App),
}).$mount('#app')
