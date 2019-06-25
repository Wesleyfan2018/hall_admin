<template>
    <el-aside class="sidebar" width="200px" style=" background-color: #304156;">
        <div class="logo">
            <img :src="require('@/assets/image/bigData.png')">
        </div>
        <div class="search">
            <el-autocomplete
            v-model="state1"
            :fetch-suggestions="querySearch"
            placeholder="请输入要搜索的内容"
            @select="handleSelect"
            ></el-autocomplete>
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <div class="menu">
                <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#1f2d3d"
                text-color="rgb(191, 203, 217)"
                active-text-color="#1f2d3d">
                    <el-submenu :index="idx.toString()" v-for="(item, idx) in menuList" :key="(item, idx)">
                        <template slot="title">
                            <i :class="item.iconCLass"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="idx + '-' + i" v-for="(t, i) in item.menuItem" :key="(t, i)" @click="clickItem(t.path)"><span>{{t.name}}</span></el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </el-scrollbar>
    </el-aside>
</template>

<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            dataInfo: null,
            restaurants: [],
            state1: '',
            menuList: [
                {
                    name: '系统管理',
                    iconCLass: 'el-icon-location',
                    menuItem: [
                        {
                            name: '用户列表1',
                            path: '/1'
                        },
                        {
                            name: '用户列表2',
                            path: '/2'
                        }
                    ]
                },
                {
                    name: '系统管理2',
                    iconCLass: 'el-icon-s-operation',
                    menuItem: [
                        {
                            name: '用户列表3',
                            path: '/3'
                        },
                        {
                            name: '用户列表4',
                            path: '/4'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        clickItem(str) {
            console.log(str);
        },
        querySearch(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll() {
            return [
                { 'value': '三全鲜食（北新泾店）' },
                { 'value': 'Hot honey 首尔炸鸡（仙霞路）' }
            ];
        },
        handleSelect(item) {
            console.log(item);
        },
        handleNodeClick(data) {
            console.log(data);
        }
    },
    mounted() {
        this.restaurants = this.loadAll();
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
</style>
<style>
/* 公共样式 */
.el-submenu__title {
    width: 200px!important;
    background-color: #304156!important;
}
.el-submenu__title:hover {
    background-color: rgb(31, 45, 61)!important;
}
.el-menu-item.is-active {
    color: #409EFF!important;
}
</style>

