import axios from '../../axios.js'

/**
 * Route
 */

const route = '/briefs'

var struct = [
  { text: 'Cookie', align: 'left', sortable: true, value: 'cookie' },
  { text: 'Servicio', align: 'left', value: 'data.service.name' },
  { text: 'Compañia', align: 'left', sortable: true, value: 'data.information.company.value' },
  { text: 'Teléfono', value: 'data.information.phone.value' },
  { text: 'Correo', value: 'data.information.email.value' },
  { text: 'Acciones', align: 'center', value: '' }
]

export default {
  namespaced: true,
  state: { all: [], defaultItem: {}, editedItem: {}, trashed: [], struct: struct },
  mutations: {
    GET_ALL (state, data) {
      state.all = data
    }
  },
  actions: {
    async getAll ({commit}) {
      try {
        let res = await axios.get(route)
        commit('GET_ALL', res.data)
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: { }
}
