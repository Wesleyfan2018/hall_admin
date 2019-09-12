import { setStorageData, getStorageData } from '@/utils/auth';
// import router from '@/router';
const tagsview = {
    state: {
        menuList: [],
        tagsList: JSON.parse(getStorageData('tagsList')) || [
            { value: '首页', path: '/', pathName: '/' }
        ],
        visiHistory: JSON.parse(getStorageData('visiHistory')) || [],
        tagIndex: Number(getStorageData('tagIndex')) || 0,
        cachedViews: JSON.parse(getStorageData('cachedViews')) || ['Dashboard'],
        activeMenuItem: getStorageData('activeMenuItem') || '0',
        Approver: []
    },
    mutations: {
        SET_APPROVER: (state, approverList) => {
            state.Approver = approverList;
        },
        SET_TAGSLIST: (state, tagsList) => {
            state.tagsList = tagsList;
        },
        SET_MENULIST: (state, menuList) => {
            state.menuList = menuList;
        },
        SET_VISIHISTORY: (state, visiHistory) => {
            state.visiHistory = visiHistory;
        },
        SET_TAGINDEX: (state, tagIndex) => {
            state.tagIndex = tagIndex;
        },
        SET_CACHEDVIEWS: (state, cachedViews) => {
            state.cachedViews = cachedViews;
        },
        SET_ACTIVEMENUITEM: (state, activeMenuItem) => {
            state.activeMenuItem = activeMenuItem;
        }
    },
    actions: {
        setVisiHistory({ commit }, visiHistory) {
            commit('SET_VISIHISTORY', visiHistory);
            setStorageData('visiHistory', visiHistory);
        },
        setMenuList({ commit }, menuList) {
            commit('SET_MENULIST', menuList);
            setStorageData('menuList', menuList);
        },
        setTagsList({ commit }, tagsList) {
            commit('SET_TAGSLIST', tagsList);
            setStorageData('tagsList', tagsList);
        },
        setTagsIndex({ commit }, tagIndex) {
            commit('SET_TAGINDEX', tagIndex);
            setStorageData('tagIndex', tagIndex);
        },
        setCachedViews({ commit }, cachedViews) {
            commit('SET_TAGSLIST', cachedViews);
            setStorageData('cachedViews', cachedViews);
        },
        setActiveMenuItem({ commit }, activeMenuItem) {
            commit('SET_ACTIVEMENUITEM', activeMenuItem);
            setStorageData('activeMenuItem', activeMenuItem);
        }
    }
};

export default tagsview;
