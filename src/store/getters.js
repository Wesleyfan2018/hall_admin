const getters = {
    token: state => state.user.token,
    g: state => state.user.g,
    e: state => state.user.e,
    menuList: state => state.tagsview.menuList,
    tagsList: state => state.tagsview.tagsList,
    visiHistory: state => state.tagsview.visiHistory,
    tagIndex: state => state.tagsview.tagIndex,
    cachedViews: state => state.tagsview.cachedViews,
    activeMenuItem: state => state.tagsview.activeMenuItem
};
export default getters;
