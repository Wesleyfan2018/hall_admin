<template>
    <div class="navbar">
        <div class="right-menu">
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
        };
    },
    methods: {
        logout() {
            router.push({
                path: '/login'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
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
        float: right;
        height: 100%;
        line-height: 50px;

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
            right: -20px;
            top: 16px;
            font-size: 20px;
            }
        }
        }
    }
}
</style>
