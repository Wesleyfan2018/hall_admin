import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import tagsview from './modules/tagsView';
import getters from './getters';
import echarts from './modules/echarts';
import base from './modules/base';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        tagsview,
        echarts,
        base
    },
    getters
});

export default store;
