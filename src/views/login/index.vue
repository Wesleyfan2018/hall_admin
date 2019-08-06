<template>
    <div class="login-container">
        <el-form class="login-form" auto-complete="on" label-position="left">
            <div class="title-container">
                <h3 class="title">Hall Data</h3>
            </div>
            <el-form-item prop="username">
                <span class="iconfont icon-user icon-icon-test3 iconStyle"></span>
                <el-input
                    ref="username"
                    v-model="username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                />
            </el-form-item>
            <el-form-item prop="password">
                <span class="iconfont icon-lock icon-icon-test2 iconStyle"></span>
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="password"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="login"
                />
                <span class="show-pwd" @click="showPwd">
                    <span
                        :class="passwordType === 'password' ? 'iconfont icon-view icon-icon-test iconStyle' : 'iconfont icon-view_off icon-icon-test1 iconStyle'"
                    ></span>
                </span>
            </el-form-item>
            <el-button
                :loading="loading"
                type="primary"
                class="loginBtn"
                @click="login"
            >Login</el-button>
        </el-form>
    </div>
</template>

<script>
import { revoke } from '@/api/getApi';
import router from '@/router';
import { setStorageData } from '@/utils/auth';
export default {
    data() {
        return {
            username: '',
            password: '',
            loading: false,
            passwordType: 'password'
        };
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = '';
            } else {
                this.passwordType = 'password';
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        login() {
            let data = {
                userName: this.username,
                password: this.password,
            };
            revoke('/hall-admin-new/index.php?m=login&p=index&g=10000', data).then(res => {
                if (res.code === 0) {
                    setStorageData('userInfo', res.data);
                    setStorageData('token', res.data.token);
                    router.push({
                        path: '/sel-project'
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

.iconStyle {
    font-size: 20px !important;
    padding: 12px 0 12px 10px !important;
}
.loginBtn {
    width: 100%;
    margin-bottom: 30px;
}
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;
            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #ffffff;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .title-container {
        position: relative;
        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .iconStyle {
        font-size: 20px !important;
        padding: 12px 0 12px 10px !important;
    }
}
</style>
