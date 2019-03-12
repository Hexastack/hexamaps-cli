import plugin from '../index'

export default {
  install(Vue, options) {
    // data
    Vue.prototype[plugin.name] = {}
    for (let d in plugin.data) {
      Object.defineProperty(Vue.prototype[plugin.name], d, {
        enumerable: true,
        get: () => this[d],
        set: (arg) => this[d] = arg
      })
    }
    // events
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
    Vue.mixin({
      created () {
        if (this.type) {
          this.$slots = {default: plugin.entityComponents(this, this[plugin.name]).map(ec =>
            this.$createElement(ec.component, {props: ec.props})
          )}
          plugin.entity(this, this[plugin.name])
        }
        if (this.isMap) {
          this.$slots = {default: plugin.mapComponents(this, this[plugin.name]).map(mc =>
            this.$createElement(mc.component, {props: mc.props})
          )}
          plugin.map(this, this[plugin.name])
        }
      }
    })
  }
}
