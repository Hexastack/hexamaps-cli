export default {
  name: '##name##',
  mapData: {
    // define your plugin data that will be used on the map
    // example
    // initialZoom: 4
  },
  entityData: {
    // define your plugin data that will be used on the entities
    // example
    // color: '#333'
  },
  map (map, plugin, data) {
    // This script will be executed when the map is created
  },
  entity (entity, plugin, data) {
    // This script will be executed eachtime an entity is created
  },
  // Uncomment the next functions to be able to customize the onClick and onHover events
  // entityOnClick (e, entity, plugin, data) {
  //   return entity
  // },
  // entityOnHover (e, entity, plugin, data) {
  //   return entity
  // },
  entityComponents (entity, plugin, data) {
    return []
  },
  mapComponents(map, plugin, data) {
    return []
  }
}
