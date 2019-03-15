import plugin from '../index'

const definition = {
  mapMixin: [],
  mapComponents: [],
  entityMixin: [],
  entityComponents: [],
  entry: {
    install(Vue, options) {
      if (plugin.entityOnClick) {
        Vue.prototype.entityOnClick = (e, entity) => {
          return plugin.entityOnClick(e, entity.expose.wrap(), entity[plugin.name], entity.map.data)
        }
      }
      if (plugin.entityOnHover) {
        Vue.prototype.entityOnHover = (e, entity) => {
          return plugin.entityOnHover(e, entity.expose.wrap(), entity[plugin.name], entity.map.data)
        }
      }
    }
  }
}
const generate = () => {
  plugin.entityComponents.pluginName = plugin.name
  definition.entityComponents = definition.entityComponents.concat(plugin.entityComponents)
  plugin.mapComponents.pluginName = plugin.name
  definition.mapComponents = definition.mapComponents.concat(plugin.mapComponents)

  definition.entityMixin.push({
    data () {
      const data = {}
      data[plugin.name] = Object.assign({}, plugin.entityData)
      return data
    },
    created () {
      plugin.entity(this, this[plugin.name], (this.map && this.map.data) ? this.map.data : [])
    }
  })
  definition.mapMixin.push({
    data () {
      const data = {}
      data[plugin.name] = plugin.mapData
      return data
    },
    created () {
      plugin.map(this, this[plugin.name], (this.map && this.map.data) ? this.map.data : [])
    }
  })
  return definition
}

export default generate
