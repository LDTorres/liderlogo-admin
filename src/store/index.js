import Vue from 'vue'
import Vuex from 'vuex'
import { mutations, STORAGE_KEY } from './mutations'
import actions from './actions'

/**
 * Modules
 */

import activities from './modules/activities'
import briefs from './modules/briefs'
import clients from './modules/clients'
import countries from './modules/countries'
import coupons from './modules/coupons'
import currencies from './modules/currencies'
import gateways from './modules/gateways'
import locations from './modules/locations'
import orders from './modules/orders'
import sectors from './modules/sectors'
import services from './modules/services'
import users from './modules/users'
import portfolios from './modules/portfolios'
import projects from './modules/projects'
import leads from './modules/leads'
import safetypay from './modules/safetypay'

import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'),
    user: JSON.parse(window.localStorage.getItem('bazam-user') || '{}'),
    token: localStorage.getItem('bazam-token') || ''
  },
  getters: {
    getAll: (state) => (stateName) => {
      state[stateName].all.forEach((element, i) => {
        state[stateName].all[i].in = i
      })

      return state[stateName].all
    },
    getAllTrashed: (state) => (stateName) => {
      state[stateName].trashed.forEach((element, i) => {
        state[stateName].trashed[i].in = i
      })

      return state[stateName].trashed
    }
  },
  actions,
  mutations,
  modules: {
    activities: activities,
    briefs: briefs,
    clients: clients,
    countries: countries,
    coupons: coupons,
    currencies: currencies,
    gateways: gateways,
    locations: locations,
    orders: orders,
    sectors: sectors,
    services: services,
    users: users,
    portfolios: portfolios,
    app: app,
    projects: projects,
    leads: leads,
    safetypay: safetypay
  }
})
