import { setStorageData, getStorageData } from '@/utils/auth';
// import router from '@/router';
const tagsview = {
    state: {
        menuList: [
            {
                name: '系统管理',
                iconCLass: 'el-icon-s-operation',
                menuItem: [
                    {
                        value: '用户列表',
                        pathName: 'Test1',
                        path: '/test1'
                    },
                    {
                        value: '登录记录',
                        pathName: 'Test2',
                        path: '/test2'
                    },
                    {
                        value: '修改密码',
                        pathName: 'changePwd',
                        path: '/changepwd'
                    }
                ]
            }
        ] || [],
        tagsList: JSON.parse(getStorageData('tagsList')) || [{ value: '首页', path: '/', pathName: '/' }],
        tagIndex: Number(getStorageData('tagIndex')) || 0,
        cachedViews: JSON.parse(getStorageData('cachedViews')) || ['Dashboard'],
        activeMenuItem: getStorageData('activeMenuItem') || '0'
    },
    mutations: {
        SET_TAGSLIST: (state, tagsList) => {
            state.tagsList = tagsList;
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
