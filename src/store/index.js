import Vuex from 'vuex'
import Vue from 'vue'
import { getGroupCount } from '@/api/getInfo.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    group_sum: [],
    time: ['2021', 'Autumn']
  },
  mutations: {
    updateGroup_num(state, val) {
      state.group_sum = val
    }
  },
  actions: {
    getGroup_num({commit}) {
      let time = {
        "year": '2021',
        "season": 'Autumn'
      }
      getGroupCount(time
      ).then((res) => {
        commit("updateGroup_num", res.data.msg)
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  getters: {
  },
  modules: {
  }
})

export default store