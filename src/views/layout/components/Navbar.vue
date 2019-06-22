<template>
    <div class="navbar">
        <div class="right-menu">
            <div style="margin: 0 20px;line-height: 70px;">
                <el-autocomplete
                class="inline-input"
                v-model="state1"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
                >
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-autocomplete>
            </div>
            <div style="margin:0 20px;line-height: 70px;">
                <el-select v-model="env" placeholder="请选择环境" style="width:140px;">
                    <el-option
                    v-for="(i, t) in options"
                    :key="(i, t)"
                    :label="i"
                    :value="t">
                    </el-option>
                </el-select>
            </div>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                <span class="iconfont icon-user icon-icon-test3 user-avatar"></span>
                <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item>
                    <span style="display:block;" @click="logout">Log Out</span>
                </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import router from '@/router';
export default {
    data() {
        return {
            restaurants: [],
            state1: '',
            options: ['正式服', '预发布服', '体验服', '测试服'],
            env: ''
        };
    },
    methods: {
        logout() {
            router.push({
                path: '/login'
            });
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
                { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
                { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' }
            ];
        },
        handleSelect(item) {
            console.log(item);
        }
    },
    mounted() {
        this.restaurants = this.loadAll();
    }
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color:transparent;

        &:hover {
        background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        display: inline-flex;
        display: -webkit-inline-flex;
        height: 100%;
        line-height: 50px;
        float: right;

        &:focus {
        outline: none;
        }

        .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
            cursor: pointer;
            transition: background .3s;

            &:hover {
            background: rgba(0, 0, 0, .025)
            }
        }
        }

        .avatar-container {
            line-height: 70px;
            margin-right: 40px;

        .avatar-wrapper {
            // margin-top: 5px;
            position: relative;

            .user-avatar {
                font-size: 25px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }

            .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            line-height: 70px;
            right: -20px;
            // top: 16px;
            font-size: 20px;
            }
        }
        }
    }
}
</style>
