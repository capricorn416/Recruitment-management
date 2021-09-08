import Vuex from 'vuex'
import Vue from 'vue'
import { getGroupCount } from '@/api/getInfo.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    group_sum: [{
      title: '产品组',
      count: 0
    },{
      title: '运营组',
      count: 0
    },{
      title: '设计组',
      count: 0
    },{
      title: '前端组',
      count: 0
    },{
      title: '后端组',
      count: 0
    },{
      title: '移动组',
      count: 0
    },{
      title: '游戏组',
      count: 0
    }],
    time: ['2021', 'Autumn']
  },
  mutations: {
    updateGroup_num(state, val) {
      state.group_sum = val
    },
    updateTime(state, val) {
      state.time = val;
    }
  },
  actions: {
    getGroup_num(store, params) {
      getGroupCount(params
      ).then((res) => {
        store.commit("updateGroup_num", res.data.msg)
      }).catch((err) => {
        console.log(err);
      });
    }
  }
})

export default store