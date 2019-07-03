<template>
    <div class="navbar">
        <div class="right-menu">
            <div v-show="showEnv" class="chaEnv">
                <a href="#">切换环境</a>
            </div>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                <span class="iconfont icon-user icon-icon-test3 user-avatar"></span>
                <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item disabled>
                    <span style="display:block;">{{userInfo.name}}</span>
                </el-dropdown-item>
                <el-dropdown-item disabled>
                    <span style="display:block;">{{userInfo.role}}</span>
                </el-dropdown-item>
                <el-dropdown-item>
                    <a style="display:block;" @click="changePwd">修改密码</a>
                </el-dropdown-item>
                <el-dropdown-item divided>
                    <span style="display:block;" @click="layLogout">注销</span>
                </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import ajax from '@/utils/ajax';
import router from '@/router';
import { getStorageData, Enmd5, removeStorageData } from '@/utils/auth';
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            userInfo: {},
        };
    },
    created() {
        this.getUserInfo();
    },
    computed: {
        showEnv: function() {
            let pathname = window.location.pathname;
            if (pathname === '/sel-project') {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        ...mapActions([
            'setTagsList',
            'setTagsIndex',
            'setActiveMenuItem'
        ]),
        getUserInfo() {
            let self = this;
            let userInfoStr = getStorageData('userInfo');
            self.userInfo = JSON.parse(userInfoStr);
        },
        layLogout() {
            let data = {};
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=login&p=logout&g=10000', data).then(res => {
                if (res.code === 0 || res.code === -99) {
                    removeStorageData('token');
                    removeStorageData('userInfo');
                    removeStorageData('tagsList');
                    removeStorageData('tagIndex');
                    removeStorageData('activeMenuItem');
                    this.setTagsList([{ value: '首页', path: '/', pathName: '/' }]);
                    this.setTagsIndex(0);
                    this.setActiveMenuItem('0');
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        changePwd() {
            router.push({
                path: '/changepwd'
            });
        }
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
        .chaEnv {
            margin: 0px 20px;
            line-height: 70px;
            font-size: 14px;
            a {
                text-decoration: none;
                color: coral;
            }
        }
    }
}
</style>
