import Vue from 'vue'
import { HmMap as Map, transpile } from 'hexamaps'
import config from '../config'
import addons from './addons'

const defaultConfig = {
  land: '#1a0e02',
  border: '#aaa',
  sea: '#80b5d5',
  width: 800,
  height: 600,
  zoom: 1,
  scale: 1,
  initialScale: 1,
  x: 0,
  y: 0,
  theta: -11,
  phi: 0,
  angle: 0,
  projectionName: 'geoMercator',
  withGraticule: false,
  withOutline: true
}

const { plugins, editables } = transpile(addons)

// for (let addonName in config.addonsConfig) {
//   for (let attr in config.addonsConfig[addonName].map) {
//     editables[addonName].map.values[attr] = config.addonsConfig[addonName].map[attr]
//   }
// }

const HmMap = Map(plugins)
const Hexamaps = {
  name: 'HexaMap',
  render: function (createElement) {
    return createElement(HmMap)
  },
  data () {
    return {
      data: [],
      source: config.sourceUrl,
      config: config.config
    }
  },
  mounted () {
    this.config = config.config
    this.load(config.dataUrl)
  },
  provide () {
    const map = { data: [], source: '', config: defaultConfig }
    Object.defineProperty(map, 'data', {
      enumerable: true,
      get: () => this.data,
      set: (data) => this.data = data
    })
    Object.defineProperty(map, 'config', {
      enumerable: true,
      get: () => this.config,
      set: (config) => this.config = config
    })
    Object.defineProperty(map, 'source', {
      enumerable: true,
      get: () => this.source
    })
    return { map }
  },
  methods: {
    load(dataUrl) {
      fetch(dataUrl)
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

Vue.use(plugins.entry, { editor: false })

new Vue({
  editor: false,
  panEnabled: true,
  zoomEnabled: true,
  render: h => h(Hexamaps)
}).$mount('#app')
