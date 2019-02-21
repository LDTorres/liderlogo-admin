/**
 * Route
 */

var struct = [
  { text: 'Id', align: 'left', sortable: true, value: 'id' },
  { text: 'Nombre', value: 'name' },
  { text: 'Descripción', value: 'description' },
  { text: 'Sector', value: 'sector.name' },
  { text: 'Acciones', align: 'center', value: ''}
]

export default {
  namespaced: true,
  state: { all: [], trashed: [], struct: struct }
}
