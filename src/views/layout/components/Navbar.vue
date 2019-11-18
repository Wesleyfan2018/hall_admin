<template>
    <div class="navbar">
        <div class="right-menu">
            <div v-show="pathname !== '/sel-project'" class="chaEnv">
                <a @click="backSelect">返回九宫格</a>
            </div>
            <div v-show="showEnv" class="chaEnv">
                <a @click="changeEnv">{{curEnv}}</a>
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
        <div class="dialog_div">
            <el-dialog title="选择环境" :visible.sync="envVisible" width="30%">
                <el-form label-position="right" label-width="120px" class="dialog-form">
                    <el-form-item
                        v-for="(item, idx) in envList"
                        :key="(item, idx)"
                        :label="item.gameName + ':'"
                    >
                        <el-radio-group v-model="envRadio">
                            <el-radio-button
                                v-for="(t, i) in item.list"
                                :key="(t, i)"
                                :label="item.game + '-' + t.env"
                            >{{t.label}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="envVisible = false">关 闭</el-button>
                    <el-button type="success" @click="confirmEnv">确 认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { revoke } from '@/api/getApi'
import router from '@/router'
import { getStorageData, removeStorageData } from '@/utils/auth'
import { mapState, mapActions } from 'vuex'
export default {
    data() {
        return {
            userInfo: {},
            pathname: window.location.pathname,
            envVisible: false,
            envRadio: '',
            curEnv: ''
        }
    },
    created() {
        this.getUserInfo()
        this.getEnvParam()
    },
    computed: {
        ...mapState({
            g: state => state.user.g,
            e: state => state.user.e,
            envList: state => state.base.envList
        }),
        showEnv: function() {
            let pathname = window.location.pathname
            if (pathname === '/sel-project') {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        ...mapActions([
            'setGame',
            'setEnv',
            'setTagsList',
            'setTagsIndex',
            'setActiveMenuItem'
        ]),
        // 获取个人信息
        getUserInfo() {
            let self = this
            let userInfoStr = getStorageData('userInfo')
            self.userInfo = JSON.parse(userInfoStr)
        },
        // 注销
        layLogout() {
            let data = {}
            revoke('/index.php?m=login&p=logout&g=10000', data).then(res => {
                if (res.code === 0 || res.code === -99) {
                    removeStorageData('token')
                    removeStorageData('userInfo')
                    removeStorageData('tagsList')
                    removeStorageData('tagIndex')
                    removeStorageData('activeMenuItem')
                    this.setTagsList([
                        { value: '首页', path: '/', pathName: '/' }
                    ])
                    this.setTagsIndex(0)
                    this.setActiveMenuItem('0')
                    router.push({
                        path: '/login'
                    })
                }
            })
        },
        // 跳转修改密码
        changePwd() {
            router.push({
                path: '/changepwd'
            })
        },
        // 返回九宫格
        backSelect() {
            router.push({
                path: '/sel-project'
            })
        },
        // 切换环境弹层
        changeEnv() {
            this.envVisible = true
        },
        // 环境选择确认
        confirmEnv() {
            this.envVisible = false
            let selectEnvStr = this.envRadio
            selectEnvStr = selectEnvStr.split(/-/)
            let g = Number(selectEnvStr[0])
            let e = Number(selectEnvStr[1])
            this.setGame(g)
            this.setEnv(e)
            let selectGame = this.envList.find(item => item.game === g)
            let selectEnv = selectGame.list.find(item => item.env === e)
            this.curEnv = selectGame.gameName + '-' + selectEnv.label
            window.location.reload()
        },
        // 获取项目、环境参数
        getEnvParam() {
            this.envRadio = this.g + '-' + this.e
            let selectGame = this.envList.find(item => item.game === this.g)
            let selectEnv = selectGame.list.find(item => item.env === this.e)
            this.curEnv = selectGame.gameName + '-' + selectEnv.label
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
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
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            line-height: 40px;
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
                    line-height: 40px;
                    right: -20px;
                    // top: 16px;
                    font-size: 20px;
                }
            }
        }
        .chaEnv {
            margin: 0;
            margin-right: 20px;
            line-height: 40px;
            font-size: 14px;
            a {
                text-decoration: none;
                color: coral;
            }
        }
    }
    .dialog_div {
        line-height: 28px;
        .el-dialog__header {
            padding: 20px 20px 10px;
            background-color: #f0f2f5;
        }
        .el-dialog__footer {
            padding: 10px 20px 20px;
            text-align: right;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background-color: #f0f2f5;
        }
    }
}
</style>
