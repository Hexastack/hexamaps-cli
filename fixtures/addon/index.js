export default {
  name: '##name##',
  // Data: https//github.com/hexastack/hexamaps/docs/addon-data
  // mapData
  // define your plugin data that will be used on the map
  // example
  // initialZoom: 4
  mapData: {
    
  },
  // entityData
  // define your plugin data that will be used on the entities
  // example
  entityData: {
    
  },
  // init functions
  /**
   * @method map - This method is called whenever the map is updated
   * @param {Object} map - The map properties https//github.com/hexastack/hexamaps/docs/map
   * @param {Object} mapData - This plugin's mapData                                                                                                                         
   * @param {*} data - User's data                                                                                                                                         
   */                                                                                                                                                                      
  map (map, mapData, data) {                                                                                                                                               
    
  },
  /**
   * @method entity - This method is called eachtime an entity is updated
   * @param {Object} entity - The entity properties https//github.com/hexastack/hexamaps/docs/entity
   * @param {Object} entityData - This plugin's entityData
   * @param {Object} mapData - This plugin's mapData
   * @param {*} data - User's data
   */
  entity (entity, entityData, mapData, data) {

  },
  // Uncomment the next functions to be able to customize the onClick and onHover events
  /**
   * @method entityOnClick - Event listner for clicks on entities
   * @param {click} e - DOM event
   * @param {Object} entity - The clicked entity readOnly & readWrite data https//github.com/hexastack/hexamaps/docs/entity
   * @param {Object} plugin - The plugin data relative to the clicked entity
   * @param {*} data - User's data
   * @returns {Object} - The readWrite entity data
   */
  // entityOnClick (e, entity, entityData, mapData, data) {
    
  // },
  /**
   * @method entityOnHover - Event listner for hover on entities
   * @param {hover} e - DOM event
   * @param {Object} entity - The hovered entity readOnly & readWrite data https//github.com/hexastack/hexamaps/docs/entity
   * @param {Object} plugin - The plugin data relative to the hovered entity
   * @param {*} data - User's data
   * @returns {Object} - The readWrite entity data
   */
  // entityOnHover (e, entity, entityData, mapData, data) {
  //   return entity
  // },
  /**
   * @method entityComponents - define components that will be used within the entities
   * @param {Object} entity - The entity data https//github.com/hexastack/hexamaps/docs/entity
   * @param {Object} plugin - This plugin entityData
   * @param {*} data - User's data
   * @return {Object[]}
   */
  entityComponents (entity, entityData, mapData, data) {
    return []
  },
  /**
   * @method mapComponents - define components that will be used within the map
   * @param {Object} map - The map data https//github.com/hexastack/hexamaps/docs/map
   * @param {Object} plugin - This plugin mapData
   * @param {*} data - User's data
   * @return {Object[]}
   */
  mapComponents(map, mapData, data) {
    return []
  }
}
