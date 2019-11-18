<template>
    <el-scrollbar
        wrap-class="scrollbar-wrapper1"
        style="width:200px;background-color: #304156;"
        :style="{height: resizeHeight + 'px'}"
    >
        <el-aside class="sidebar" width="200px" style=" background-color: #304156;">
            <div class="logo">
                <img :src="require('@/assets/image/bigData.png')" />
            </div>
            <div class="search">
                <el-autocomplete
                    v-model="state1"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入要搜索的内容"
                    @select="handleSelect"
                ></el-autocomplete>
            </div>
            <el-scrollbar wrap-class="scrollbar-wrapper2">
                <div class="menu">
                    <el-menu
                        :default-active="activeMenuItem"
                        :unique-opened="true"
                        class="el-menu-vertical-demo"
                        background-color="#1f2d3d"
                        text-color="rgb(191, 203, 217)"
                        active-text-color="#1f2d3d"
                    >
                        <el-submenu
                            :index="idx.toString()"
                            v-for="(item, idx) in menuList"
                            :key="(item, idx)"
                        >
                            <template slot="title">
                                <i :class="item.iconCLass"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item
                                :index="idx + '-' + i"
                                v-for="(t, i) in item.menuItem"
                                :key="(t, i)"
                                @click="clickItem(t)"
                            >
                                <span>{{t.value}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
            </el-scrollbar>
        </el-aside>
    </el-scrollbar>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { revoke } from '@/api/getApi';
import router from '@/router';
export default {
    name: 'Sidebar',
    data() {
        return {
            dataInfo: null,
            menuItems: [],
            state1: ''
        };
    },
    computed: {
        ...mapState({
            menuList: state => state.tagsview.menuList,
            cachedViews: state => state.tagsview.cachedViews,
            tagsList: state => state.tagsview.tagsList,
            visiHistory: state => state.tagsview.visiHistory,
            tagIndex: state => state.tagsview.tagIndex,
            activeMenuItem: state => state.tagsview.activeMenuItem
        }),
        resizeHeight() {
            return document.body.clientHeight;
        }
    },
    created() {
        this.getMenList();
    },
    methods: {
        ...mapActions([
            'setTagsList',
            'setMenuList',
            'setTagsIndex',
            'setActiveMenuItem',
            'setVisiHistory'
        ]),
        // 获取菜单
        getMenList() {
            let data = { 'entry_point': 0 };
            revoke('/index.php?m=system&p=init', data).then(res => {
                if (res.code === 0) {
                    let menuList = res.data.menu;
                    this.setMenuList(menuList);
                    this.loadAll();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 更改menuItem打开的index
        activeItem(str) {
            let menuIndex = Number;
            let itemIndex = Number;
            if (str === '/') {
                return '0';
            }
            for (let i in this.menuList) {
                if (
                    this.menuList[i].menuItem.findIndex(
                        item => item.path === str
                    ) !== -1
                ) {
                    menuIndex = i;
                    itemIndex = this.menuList[i].menuItem
                        .map(item => item.path)
                        .indexOf(str);
                }
            }
            let activeIndex = menuIndex + '-' + itemIndex;
            return activeIndex;
        },
        clickItem(obj) {
            if (
                this.visiHistory.findIndex(item => item.path === obj.path) ===
                    -1 &&
                obj.path !== '/'
            ) {
                this.visiHistory.unshift(obj);
                this.setVisiHistory(this.visiHistory);
            }
            if (
                this.tagsList.findIndex(item => item.path === obj.path) === -1
            ) {
                this.tagsList.push(obj);
                this.setTagsList(this.tagsList);
                this.cachedViews.push(obj.pathName);
                this.$store.commit('SET_CACHEDVIEWS', this.cachedViews);
            }
            let indexNum = this.tagsList
                .map(item => item.path)
                .indexOf(obj.path);
            this.setTagsIndex(indexNum);
            let index = this.activeItem(obj.path);
            this.setActiveMenuItem(index);
            router.push({
                path: obj.path
            });
        },
        querySearch(queryString, cb) {
            let menuItems = this.menuItems;
            let results = queryString
                ? menuItems.filter(this.createFilter(queryString))
                : menuItems;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return menuItem => {
                return (
                    menuItem.value
                        .trim()
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) >= 0
                );
            };
        },
        loadAll() {
            let self = this;
            for (let i in self.menuList) {
                let itemList = self.menuList[i].menuItem;
                for (let t in itemList) {
                    self.menuItems.push(itemList[t]);
                }
            }
        },
        handleSelect(obj) {
            if (
                this.tagsList.findIndex(item => item.path === obj.path) === -1
            ) {
                this.tagsList.push(obj);
                this.setTagsList(this.tagsList);
                this.cachedViews.push(obj.pathName);
                this.$store.commit('SET_CACHEDVIEWS', this.cachedViews);
            }
            let indexNum = this.tagsList
                .map(item => item.path)
                .indexOf(obj.path);
            this.setTagsIndex(indexNum);
            router.push({
                path: obj.path
            });
        }
    }
};
</script>

<style lang="scss">
// logo部分
.logo {
    width: 100%;
    height: 60px;
    text-align: center;
    margin: 0 auto;
    margin-top: 10px;
    img {
        height: 100%;
    }
}
// 搜索框部分
.search {
    width: 80%;
    margin: 10px auto;
    input {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
}
.scrollbar-wrapper1 {
    overflow: scroll;
    overflow-x: hidden;
    height: 100%;
}
</style>
<style>
/* 公共样式 */
.el-submenu__title {
    width: 200px !important;
    background-color: #304156 !important;
}
.el-submenu__title:hover {
    background-color: rgb(31, 45, 61) !important;
}
.el-menu-item.is-active {
    color: #409eff !important;
}
</style>

