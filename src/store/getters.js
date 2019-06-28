const getters = {
    token: state => state.user.token,
    menuList: state => state.tagsview.menuList,
    tagsList: state => state.tagsview.tagsList,
    tagIndex: state => state.tagsview.tagIndex,
    cachedViews: state => state.tagsview.cachedViews,
    activeMenuItem: state => state.tagsview.activeMenuItem
};
export default getters;
